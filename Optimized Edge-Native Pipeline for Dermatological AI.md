# **Optimized Edge-Native Pipeline for Dermatological AI**

## **1\. Pipeline Topology Overview**

This updated architecture moves from a linear "Pass-Through" model to an **Agentic Router** model. By shifting logic to the edge and utilizing a "Small Expert" approach, we reduce latency, minimize 11B inference costs, and improve diagnostic accuracy.

Old Flow:  
Client \-\> Supabase Function \-\> Cloudflare Worker \-\> Llama 3.2 11B \-\> Result  
New Optimized Flow:  
Client \-\> Cloudflare Worker (Auth \+ WASM Preprocessing) \-\> Llama 1B (Router) \-\> \-\> Llama 11B (Expert) \-\> Result

## ---

**2\. Phase 1: Secure Ingress & Auth (Latency Optimization)**

**Goal:** Eliminate the "double hop" latency of proxying through Supabase Edge Functions.

### **Implementation**

Instead of routing requests through Supabase, the Client App calls the Cloudflare Worker directly. The Worker validates the Supabase session locally.

* **Endpoint:** POST https://api.your-domain.com/v2/analyze  
* **Headers:** Authorization: Bearer \<SUPABASE\_JWT\>  
* **Logic:**  
  1. Worker receives request.  
  2. Verifies JWT signature using the stored SUPABASE\_JWT\_SECRET.  
  3. Extracts user\_id from the token claims.  
  4. **Impact:** Saves \~200-400ms per request by removing the cold-start overhead of the Supabase container.1

## ---

**3\. Phase 2: Intelligent Preprocessing (Vision Optimization)**

**Goal:** Maximize model attention on the lesion by removing artifacts (hair) and aligning image dimensions with the model's native patch size.

### **3.1 Step A: "Digital Shaving" (Artifact Removal)**

Hair occluding a lesion is a primary cause of AI misclassification. We implement a lightweight implementation of the **DullRazor** algorithm using wasm-vips (WebAssembly) directly in the Worker.

* **Library:** @denodecom/wasm-vips (runs in Cloudflare Workers).  
* **Algorithm Steps:**  
  1. **Grayscale Conversion:** Isolate the luminance channel.  
  2. **Morphological Closing:** Apply a closing operation (dilation followed by erosion) to identify dark hair strands against the lighter skin.  
  3. **Mask Generation:** Create a binary mask of the hair pixels.  
  4. **Inpainting:** Replace pixels in the mask using bilinear interpolation from neighboring skin pixels.

### **3.2 Step B: "Smart Tiling" (Resolution Alignment)**

Llama 3.2 Vision processes images in fixed tiles of **336x336 pixels**.2 Arbitrary resizing (e.g., to 800x800) forces the model to pad the image, wasting tokens and reducing effective resolution.

* **Logic:** Resize the input image to the nearest **multiple of 336** that fits within the 4-tile limit (1120x1120).  
* **Target Resolutions:**  
  * 672 x 672 (2x2 grid)  
  * 1008 x 1008 (3x3 grid) \- *Recommended for high-detail macro shots.*  
  * 672 x 336 (2x1 grid)  
* **Outcome:** Ensures 100% of visual tokens sent to the model represent actual image data, not black padding.3

## ---

**4\. Phase 3: The "Slim Proxy" Router (Cost & Context)**

**Goal:** Use a cheap, fast model to retrieve context *before* the expensive vision inference.

### **Implementation**

We use **Llama 3.2 1B Instruct** (or 3B) as the "Orchestrator".

**Process:**

1. **Input:** User metadata (e.g., "Patient age 45, history of sun exposure") \+ basic image statistics (from WASM).  
2. **Task:** The 1B model determines *which* medical guidelines are relevant.  
   * *Prompt:* "Based on this patient profile, identify the top 3 relevant dermatological risk factors and generate a search query for the guidelines database."  
3. **Retrieval (RAG):**  
   * Query **Cloudflare Vectorize** with the generated search terms.  
   * Retrieve strict clinical guidelines (e.g., "ABCDE rule definitions", "Melanoma risk factors for age \> 40").  
4. **Outcome:** We now have a "Context Block" to feed the vision model. This prevents the "hallucination of guidelines" by providing the ground truth explicitly.4

## ---

**5\. Phase 4: Expert Inference (Reliability)**

**Goal:** Guarantee machine-readable, strictly formatted diagnoses using the 11B model.

### **5.1 The Prompt Construction**

Combine the "Digital Shaved" image \+ the "Slim Proxy" Context Block.

**System Prompt:** "You are an expert dermatologist assistant. Analyze the provided image. Use the following clinical guidelines as ground truth: {RAG\_CONTEXT}. Return your analysis in valid JSON."

### **5.2 JSON Schema Enforcement**

Instead of prompting "Please give me JSON", we use the response\_format parameter supported by Cloudflare Workers AI.

**Schema Definition:**

JSON

{  
  "type": "json\_schema",  
  "json\_schema": {  
    "name": "DermatologyAnalysis",  
    "schema": {  
      "type": "object",  
      "properties": {  
        "visual\_findings": {  
          "type": "object",  
          "properties": {  
            "symmetry": { "type": "string", "enum": \["symmetrical", "asymmetrical"\] },  
            "borders": { "type": "string", "enum": \["regular", "irregular", "faded"\] },  
            "colors": { "type": "array", "items": { "type": "string" } }  
          },  
          "required": \["symmetry", "borders", "colors"\]  
        },  
        "risk\_assessment": {  
          "type": "object",  
          "properties": {  
            "score": { "type": "integer", "minimum": 1, "maximum": 10 },  
            "justification": { "type": "string" }  
          },  
          "required": \["score", "justification"\]  
        }  
      },  
      "required": \["visual\_findings", "risk\_assessment"\]  
    }  
  }  
}

### **5.3 Privacy Compliance**

* **Zero Data Retention:** Ensure the API call to Workers AI includes the flag (or account setting) to prevent Meta/Cloudflare from logging the image for training.5

## ---

**6\. Phase 5: Asynchronous Persistence**

**Goal:** Store results without blocking the response to the user.

### **Implementation**

1. **Return Early:** As soon as the JSON is generated, stream the response to the Client.  
2. **WaitUntil Pattern:** Use ctx.waitUntil() in the Cloudflare Worker to handle the database write in the background.  
3. **Hyperdrive:** Connect to Supabase via **Cloudflare Hyperdrive** to reuse existing connection pools, ensuring the INSERT operation takes \<10ms.6

TypeScript

// Background write example  
ctx.waitUntil(  
  pool.connect().then(client \=\>   
    client.query('INSERT INTO scans (user\_id, result, image\_url) VALUES ($1, $2, $3)',   
    \[userId, diagnosisJson, r2Url\])  
  )  
);

## ---

**Summary of Improvements**

| Component | Old Implementation | New Optimized Pipeline | Benefit |
| :---- | :---- | :---- | :---- |
| **Ingress** | Supabase Proxy | **Direct Worker \+ Local Auth** | **\-300ms Latency** |
| **Input Image** | Raw / Basic Resize | **WASM "Digital Shaving" \+ Smart Tiling** | **Higher Diagnostic Accuracy** |
| **Routing** | Direct to 11B | **Llama 1B Router \-\> Vectorize** | **Lower Cost \+ Better Context** |
| **Inference** | Text Prompting | **JSON Schema Enforcement** | **100% Reliable Parsing** |
| **Storage** | Synchronous Write | **Async waitUntil \+ Hyperdrive** | **Faster User Response** |

#### **Works cited**

1. Best Practices for Securing and Scaling Supabase for Production Data Workloads | by firman brilian | Medium, accessed January 4, 2026, [https://medium.com/@firmanbrilian/best-practices-for-securing-and-scaling-supabase-for-production-data-workloads-4394aba9e868](https://medium.com/@firmanbrilian/best-practices-for-securing-and-scaling-supabase-for-production-data-workloads-4394aba9e868)  
2. Does LLaMA 3.2 11B Vision scale all images to the same size? : r/LocalLLaMA \- Reddit, accessed January 4, 2026, [https://www.reddit.com/r/LocalLLaMA/comments/1gev0vp/does\_llama\_32\_11b\_vision\_scale\_all\_images\_to\_the/](https://www.reddit.com/r/LocalLLaMA/comments/1gev0vp/does_llama_32_11b_vision_scale_all_images_to_the/)  
3. Mllama \- Hugging Face, accessed January 4, 2026, [https://huggingface.co/docs/transformers/model\_doc/mllama](https://huggingface.co/docs/transformers/model_doc/mllama)  
4. \[Quick Review\] Small Models, Big Insights: Leveraging Slim Proxy Models To Decide When and What to Retrieve for LLMs \- Liner, accessed January 4, 2026, [https://liner.com/review/small-models-big-insights-leveraging-slim-proxy-models-to-decide](https://liner.com/review/small-models-big-insights-leveraging-slim-proxy-models-to-decide)  
5. I Found 50+ Companies Accidentally Breaking HIPAA With ChatGPT \- DEV Community, accessed January 4, 2026, [https://dev.to/dannwaneri/i-found-50-companies-accidentally-breaking-hipaa-with-chatgpt-1olc](https://dev.to/dannwaneri/i-found-50-companies-accidentally-breaking-hipaa-with-chatgpt-1olc)  
6. Supabase · Cloudflare Workers docs, accessed January 4, 2026, [https://developers.cloudflare.com/workers/databases/third-party-integrations/supabase/](https://developers.cloudflare.com/workers/databases/third-party-integrations/supabase/)