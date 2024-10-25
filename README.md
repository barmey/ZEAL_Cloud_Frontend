# NSDI_Labeling_system
ZEAL - Labeling system for unseen IoT Devices
Cybersecurity companies and network device manufacturers aim to provide visibility to the devices connceted to their networks and reveal both vendor
(e.g., nest, ring, etc.) and function (e.g., speaker, camera, vacuum cleaner, etc.). We address the challenge of type labeling of an
unseen IoT device.  We introduce a novel IoT labeling system, Zero-shot Engine for IoT Asset
Labeling (ZEAL). The solution extracts textual features from the device’s traffic log, enriches them with Google search
data, and employs large language models (LLM) to label the device. ZEAL uses a catalog of known IoT device types to
employ zero-shot classification techniques. Additionally, it integrates an auto-update mechanism that harnesses the power
of LLM to continuously enrich the catalog with emerging device types. 
![alt text](https://github.com/barmey/NSDI_Labeling_system/blob/main/EnrichmentProcess4.png)
