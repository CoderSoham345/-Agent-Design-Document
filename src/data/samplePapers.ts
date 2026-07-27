import { UploadedDocument } from '../types';

export const SAMPLE_YOLO_PAPERS: UploadedDocument[] = [
  {
    id: 'sample-doc-1',
    name: 'A_Review_on_YOLOv8_and_its_Advancements.pdf',
    size: 482000,
    type: 'pdf',
    title: 'A Review on YOLOv8 and its Advancements',
    authors: 'Mupparaju Sohan, Thotakura SaiRam, Ch. Venkata RamiReddy (VIT-AP University, 2023)',
    uploadDate: new Date().toISOString(),
    pageCount: 19,
    wordCount: 4200,
    content: `
A Review on YOLOv8 and its Advancements
Authors: Mupparaju Sohan, Thotakura SaiRam, Ch. Venkata RamiReddy
Institution: School of Computer Science and Engineering, VIT-AP University, Amaravati, India (2023)

Abstract:
Identifying objects is a crucial task in computer vision that finds its application in several fields like robotics, medical imaging, surveillance systems, and autonomous vehicles. The newest version of the YOLO model, YOLOv8, which is an advanced real-time object detection framework, has attracted the attention of the research community. Of all the popular object recognition machine learning models such as Faster R-CNN, SSD, and RetinaNet, YOLO is the most popular in terms of accuracy, speed, and efficiency. This review article provides an analysis of YOLOv8, highlighting its innovative features, improvements, applicability in different environments and performance metrics in comparison to other versions and models.

Keywords: YOLO, Object detection, Image classification, Instance segmentation, Computer vision, Review.

Key Highlights & Architecture:
1. Timeline & History:
- Object detection evolved from two-stage detectors (R-CNN, SPPNet, Fast R-CNN, Faster R-CNN, FPN) to one-stage detectors (YOLOv1 through YOLOv8, SSD).
- YOLOv1 (Redmon et al., 2015), YOLOv2 (2017), YOLOv3 (2018), YOLOv4 (2020), YOLOv5 (Glenn Jocher et al., Ultralytics 2020), YOLOv6 (Meituan 2022), YOLOv7 (Chien-Yao Wang et al., 2022), YOLOv8 (Ultralytics, released Jan 10, 2023).

2. Architectural Advancements in YOLOv8:
- Backbone: Uses a modified CSPDarknet53 architecture with 53 convolutional layers and C2f module (replacing C3 of YOLOv5). C2f concatenates outputs of all Bottleneck layers to enhance cross-stage feature transmission. Uses SPPF (Spatial Pyramid Pooling Fast).
- Head: Detachable, anchor-free detection head. Separates objectness scores, classification, and regression tasks into independent branches.
- Loss Functions: CIoU loss and Distribution Focal Loss (DFL) for bounding box regression, with binary cross-entropy for classification.
- Anchor-Free Paradigm: Eliminates pre-defined anchor boxes, predicting object centers directly. Reduces box candidates and speeds up Non-Maximum Suppression (NMS).

3. Performance Metrics on COCO val2017 (640x640):
- YOLOv8n (Nano): mAPval 50-95: 37.3%, Params: 3.2M, FLOPs: 8.7B, Speed CPU ONNX: 80.4ms, Speed A100 TensorRT: 0.99ms.
- YOLOv8s (Small): mAPval 50-95: 44.9%, Params: 11.2M, FLOPs: 28.6B, Speed CPU ONNX: 128.4ms, Speed A100 TensorRT: 1.20ms.
- YOLOv8m (Medium): mAPval 50-95: 50.2%, Params: 25.9M, FLOPs: 78.9B, Speed CPU ONNX: 234.7ms, Speed A100 TensorRT: 1.83ms.
- YOLOv8l (Large): mAPval 50-95: 52.9%, Params: 43.7M, FLOPs: 165.2B, Speed CPU ONNX: 375.2ms, Speed A100 TensorRT: 2.39ms.
- YOLOv8x (Extra Big): mAPval 50-95: 53.9%, Params: 68.2M, FLOPs: 257.8B, Speed CPU ONNX: 479.1ms, Speed A100 TensorRT: 3.53ms.

4. Roboflow 100 (RF100) Multi-Domain Benchmark:
- Evaluated on 100 datasets across satellite, microscopic, gaming, underwater, video games, documents, aerial categories.
- YOLOv8 achieved mAP@.50 of 80.2% on RF100 compared to 73.5% for YOLOv5. Outperformed YOLOv5 and YOLOv7 across all domain categories with fewer parameters and higher consistency.

5. Applications & Tasks:
- Tasks supported: Object Detection, Instance Segmentation (-seg), Image Classification (-cls), Pose Estimation (-pose), and Object Tracking (Track mode).
- Applications: Autonomous vehicles, medical imaging (tumor/lesion detection), manufacturing defect detection, surveillance & security, precision agriculture, robotics, environmental monitoring, and traffic management.
    `.trim()
  },
  {
    id: 'sample-doc-2',
    name: 'Improved_small_object_detection_using_YOLOv8.pdf',
    size: 320000,
    type: 'pdf',
    title: 'Improved small-object detection using YOLOv8: A comparative study',
    authors: 'Huadong Huang, Binyu Wang, Jiannan Xiao, Tianyu Zhu (2023)',
    uploadDate: new Date().toISOString(),
    pageCount: 9,
    wordCount: 2800,
    content: `
Improved small-object detection using YOLOv8: A comparative study
Authors: Huadong Huang, Binyu Wang, Jiannan Xiao, Tianyu Zhu
Published: Proceedings of the 2023 International Conference on Machine Learning and Automation (2023)

Abstract:
In the field of target detection, YOLO model is a popular real-time target detection algorithm model that is fast, efficient, and accurate. This research aims to optimize the latest YOLOv8 model to improve its detection of small objects and compare it with other versions of YOLO models (YOLOv3, YOLOv5n). We optimized the definition of the detection head, narrowed its perceptual field, and increased its number (adding a P2/4-xsmall head for 160*160 feature maps targeting objects >= 4*4 pixels). The experimental results show that our optimized model improves small object detection with higher accuracy, achieving recall >80% and average 30 FPS.

Key Methodology & Architectural Modification:
- Deficiencies of Original YOLOv8: Default YOLOv8 has 3 detection heads (P3/8 for >8x8 pixels at 80x80 resolution, P4/16 for >16x16 at 40x40 resolution, and P5/32 for >32x32 at 20x20 resolution). It struggles with tiny, dense objects (< 8x8 pixels) and causes missed detections or overlapping bounding boxes.
- Optimization Solution: Added a 4th tiny object detection layer (P2/4-xsmall head) producing a 160*160 feature map connected via C2f with 128 channels. This extracts shallower, higher-resolution feature maps targeting targets as small as 4*4 pixels.

Datasets & Training Setup:
1. SOD (Small Object Detection) Dataset: 640x640 scaled images with average object size 25x25 pixels. Trained for 30 epochs, batch size 3.
2. Bacterial Colony Dataset: 1280x1295 scaled images containing large (10x10) and tiny (2x2) bacteria colonies. Trained for 15 epochs, batch size 10.

Experimental Results & Comparative Findings:
- SOD Dataset:
  - Original YOLOv8n: Precision = 88.4% (approx), Recall = 69.7%, mAP50 = 74.2%.
  - Optimized YOLOv8n: Precision = 92.4% (+4.0%), Recall = 73.4% (+3.7%), mAP50 = 78.4% (+4.2%).
  - Training speed in early epochs (first 5 epochs) was ~10% higher in mAP50 for the optimized model.
- Bacterial Colony Detection Task:
  - Precision increased by +4.2%, Recall increased by +4.0%, and mAP50 increased by +9.2% over original YOLOv8.
  - Achieved recall higher than 80% with an average inference speed of 30 FPS.
- Comparison with Older Models (Table 1 Metrics):
  - YOLOv3: train/box_loss = 1.6007, val/box_loss = 1.5243, recall = 0.72661, precision = 0.91641.
  - YOLOv5n: train/box_loss = 1.7389, val/box_loss = 1.6979, recall = 0.65559, precision = 0.88717.
  - YOLOv8 original: train/box_loss = 1.6547, val/box_loss = 1.5848, recall = 0.69713, precision = 0.88717.
  - YOLOv8 optimized: train/box_loss = 1.7455, val/box_loss = 1.7082, recall = 0.72483, precision = 0.92441.

Limitations & Trade-offs:
- Adding extra detection heads increases network loss slightly (train box loss = 1.7455 vs 1.6547) and adds parameter overhead.
- Adding too many heads slows down training and inference speed for standard-sized objects.
- Does not explicitly model object occlusion/coverage in ultra-dense tiny object clusters.
    `.trim()
  },
  {
    id: 'sample-doc-3',
    name: 'Optimized_YOLOv8_for_Multi_Scale_Object_Detection.pdf',
    size: 410000,
    type: 'pdf',
    title: 'Optimized YOLOv8 for Multi-Scale Object Detection',
    authors: 'Areeg Fahad Rasheed, M. Zarkoosh (Journal of Real-Time Image Processing / HAL, 2024/2025)',
    uploadDate: new Date().toISOString(),
    pageCount: 15,
    wordCount: 3600,
    content: `
Optimized YOLOv8 for Multi-Scale Object Detection
Authors: Areeg Fahad Rasheed, M. Zarkoosh
Institution: College of Information Engineering, Al-Nahrain University, Baghdad, Iraq (Published 2024/2025)

Abstract:
Object detection is one of the main tasks in computer vision. Standard YOLOv8 offers five variants, the smallest comprising 225 layers. Utilizing full YOLOv8 for specific object size distributions or resource-constrained edge devices entails unnecessary computational costs and energy consumption. In this paper, we introduce six modified specialized versions of YOLOv8 tailored for specific object size profiles: small (<=32^2), medium (>32^2 & <=96^2), large (>96^2), small-medium (<=96^2), medium-large (>32^2), and small-large (<=32^2 or >96^2). We evaluate these models across 6 domain datasets based on computational cost (GFLOPs), energy/power usage (Watts), parameter count, layer count, inference time (ms), and mAP50.

Methodology & Object Size Classifier:
- Developed an automated program called 'ObjectSizeClassifier' that calculates object bounding box areas across datasets and categorizes objects into size bins:
  * Small: area <= 32^2 pixels (1024 px^2)
  * Medium: 32^2 < area <= 96^2 pixels (9216 px^2)
  * Large: area > 96^2 pixels
- 6 Tailored Architecture Modifications:
  1. YOLOv8-small: Removed backbone blocks 7, 8 and neck blocks 10-12, 16-21. Retains only small head.
  2. YOLOv8-medium: Removed neck blocks 13-15 (small) and 19-21 (large). Retains medium head.
  3. YOLOv8-large: Retains backbone 0-9; removes neck blocks 10-18. Retains large head.
  4. YOLOv8-small-medium (sm): Retains blocks 0-18; removes large detection head (blocks 19-21).
  5. YOLOv8-medium-large (ml): Removes small detection head (blocks 13-15).
  6. YOLOv8-small-large (sl): Removes medium detection head (blocks 15-17).

Datasets Tested (6 Diverse Datasets):
1. WeedCrop (Small object target): 18,693 total objects (15,237 small).
2. BCCD-V4 (Medium object target): 11,780 total objects (10,094 medium blood cells).
3. Underwater Pipes (Large object target): 12,238 total objects (11,683 large).
4. Aerial Airport (Small-Medium target): 11,731 total objects (9,008 small, 2,682 medium airplanes).
5. Animals (Medium-Large target): 1,879 total objects (814 medium, 961 large).
6. Face Detection (Small-Large target): 620 total objects (21 small, 599 large).

Experimental Results & Comparative Metrics (Table 3):
- WeedCrop Dataset:
  * Original YOLOv8: Size = 6.3 MB, GFLOPs = 8.2, Layers = 225, Params = 3.0M, Inference = 2.1ms, Recall = 70.78%, Precision = 61.01%, mAP50 = 65.08%.
  * YOLOv8-small: Size = 1.4 MB (-77.8%), GFLOPs = 5.3 (-35.4%), Layers = 120 (-46.7%), Params = 0.6M (-80.0%), Inference = 0.8ms (-61.9%), Recall = 68.13%, Precision = 59.09%, mAP50 = 64.50% (difference <0.6%).
- BCCD Dataset:
  * Original YOLOv8: Size = 6.3 MB, GFLOPs = 8.2, Layers = 225, Params = 3.0M, Inference = 2.0ms, Recall = 91.61%, Precision = 83.24%, mAP50 = 92.01%.
  * YOLOv8-medium: Size = 4.4 MB, GFLOPs = 5.5, Layers = 157, Params = 2.0M, Inference = 0.9ms (-55.0%), Recall = 93.77% (+2.16%), Precision = 81.45%, mAP50 = 91.92%.
- Aerial Airport Dataset:
  * Original YOLOv8: Size = 6.3 MB, GFLOPs = 8.2, Layers = 225, Inference = 2.7ms, Recall = 84.32%, Precision = 93.67%, mAP50 = 92.04%.
  * YOLOv8-sm (Small-Medium): Size = 4.2 MB, GFLOPs = 7.4, Layers = 190, Params = 2.0M, Inference = 2.2ms, Recall = 86.18% (+1.86%), Precision = 93.10%, mAP50 = 92.52% (+0.48%).
- Energy & Power Consumption Analysis:
  * Modified single-head models consistently consumed lower GPU Wattage throughout training and completed training significantly faster than default YOLOv8.

Limitations & Recommendations:
- Tested under controlled dataset environments; recommends further testing under uncontrolled open-world/weather scenarios.
- When object sizes dynamically shift during deployment (e.g. video zooming), offline learning or dynamic switching between size-specific models is recommended.
    `.trim()
  }
];
