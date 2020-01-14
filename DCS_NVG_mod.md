---
layout: page
title: DCS NVG Mod
---

![head_img]({{site.baseurl}}/images/NVG/nvg-mod.jpg)


## **Introduction**

This is an NVG mod I reworked for DCS World 1.5 and 2.0 to generate a realistic NVG effect instead of the stock effect. It is based on the work created Nrgized with the help of PeterP and few others from the eagle dynamic forums on this [thread](http://forums.eagle.ru/showthread.php?t=100333) **(in future I will refer to this as Version 1)**. The rework was required since DCS 1.5 and above uses the new Eagle Dynamics Graphics Engine (EDGE) which is based on DirextX11 (DX11). Version 1 was coded using DX9 and was not compatible at all due to the significant changes, for the better, in the Higher Level Shading Language (HLSL).

A quote of mine from the initial thread I started on the [Online 1st Cav Div](http://1stcavdiv.conceptbb.com/) forums (online handle is Frenchy) can give some perspective on where I started skill wise in this endeavor. I want to emphasis I have no background in shader coding at all but all my maths studies at uni (some in writing code to calculate numerical solutions for 2nd order non linear differential equations for example) have given me a nice advantage.

> _Hey guys, Uni is finished for the year and this is number 1 on my to do list._
>
> _Spent all day breaking down the standard DCS NVG implementation and learning some basics of HLSL. Im now confident in how I need to go about making basic color and intensity changes._
>
> _Ive just started looking into what this actual mod did and how. Will take me a little bit (next few days around work etc) to figure it all out but I think I will be able to achieve something similar 🙂 if not it will at least be stepping stones to getting close._
>
> _My plan of attack is first and easiest (i think) should be the color/intensities. Next will be the noise (or lack thereof if the scene is bright) and then finally the zoom and ring._
>
> _PS. I dont have the black shark so the A10 is my primary concern but once done i might get the blackshark and try to do that one as well._

Now that “few days” turned into a few weeks banging my head against a wall learning the intricacies of HLSL and decomposing the version 1 mod with no comments which overall wasn’t very clear or efficient.

## **Current Status**

Version 2.0.6  
– NATO and Russian NVG’s simulated with user controllable gain, noise/grain, size and ring thickness.  
– Third iteration of my code development to simplify understanding and make more efficient.  
– JSGME ready, just extract to your JSGME mod folder and then install with JSGME  
– Download [**Here**](https://drive.google.com/open?id=0B1s7D5Bzv2DFc0ZBbFI0V1Bnb28)

<iframe src="https://www.youtube.com/embed/bo6KyQYFCLk" width="853" height="480" frameborder="0" allowfullscreen="allowfullscreen"></iframe>

## **Instructions**

1\. Extract from .rar to JSGME mod folder  
2\. Adjust variables in “JSGME MOD FOLDER\Frenchys NVG Mod 2.0.6\Bazar\shaders\common\MOD_nvg.hlsl” to change shape etc. You MUST change the variables before applying the mod in JSGME  
3\. Apply Mod in JSGME

### Variables Guide

####Render Mode:

0 = full screen,  
1 = NVG with no ring,  
2 = NVG with Ring,  
3 = NVG with ring and slight zoom (not functional)

![NVG 2.0.4](http://damienstpierre.com/images/NVG/render-modes.jpg)

####Eye Size and position:

EYE_CENTER = sets center point of NVG effect on screen as percentage of X and Y starting at bottom left corner. eg (0.5f, 0.655f) = 50% across and 65.5% up.  
EYE_SIZE = Sets X and Y diameter of NVG as percentage of screen size. eg (0.47f, 0.75f) = 47% of width of screen and 75% of screen height. Since most monitors aren’t square the y value will have to be larger than the x value to make a perfect circle; the ratio between the two numbers will be the same as your monitor aspect ratio

####Gain/Noise controls:

NVG_LIFT = gain multiplication value (.10 for A10 and .08 for KA50 are good starting points)  
NVG_NOISE = noise division value, larger value means less noise (3 for A10 and 4 for KA50 are good starting points)

####Ring Thickness  
Note – if using render mode 1 nvg will only be size of RInner. ie size = RInner(percentage) * Eye_Size = actual size.

ROFade = % radius of circle where black ring starts to fade out to regular view  
RMerge = % radius of circle where black ring becomes 100% black on inside edge  
RInner = % radius of circle where green NVG lens start to transition to black ring

I personally prefer a thin ring and this mod is released as such but some real world users (thank you Giaco) recommend the following ring sizes (that you need to set yourself):

> static const float ROFade = 0.90f;  
> static const float RMerge = 0.65f;  
> static const float RInner = 0.63f;

## **Release History**

### **Version 2.0.6**

– Download [**Here**](https://drive.google.com/open?id=0B1s7D5Bzv2DFc0ZBbFI0V1Bnb28)  
– Re coded noise and gain code to something I understand and a little simpler  
– Added user controllable gain and noise settings

NVG_LIFT = gain multiplication value (.10 for A10 and .08 for KA50 are good starting points)  
NVG_NOISE = noise division value, larger value means less noise (3 for A10 and 4 for KA50 are good starting points)

– Ring thickness now user controlled by adjustable parameters. (SAME AS 2.0.5)

ROFade = % radius of circle where black ring starts to fade out to regular view  
RMerge = % radius of circle where black ring becomes 100% black on inside edge  
RInner = % radius of circle where green NVG lens start to transition to black ring

NOTE1: if using render mode 1 nvg will only be size of RInner. ie size = RInner(percentage) * Eye_Size = actual size

NOTE2: I personally prefer a thin ring and this mod is released as such but some real world users (thankyou Giaco) recommend ring sizes as follows (that you need to set yourself):

static const float ROFade = 0.90f;  
static const float RMerge = 0.65f;  
static const float RInner = 0.63f;

– As per 2.0.4 DONT USE render mode 3, not implemented yet (possibly never, personally not very interested in the effect since mouse clicking buttons don’t line up)  
– Adjust variables in “\Frenchys NVG Mod 2.0.6\Bazar\shaders\common\MOD_nvg.hlsl” to change shape etc.

* * *

### **Version 2.0.5**

– Download [**Here**](https://drive.google.com/open?id=0B1s7D5Bzv2DFS2xHS1FMZTh1MDA)  
– Re coded lens, ring and overall mask equations. Neater code in my opinion  
– Fixed laser mask issue (possibly discovered bug in DCS with regards to laser rendering – see black line on laser path outside NVG ring in picture below)  
– Ring thickness now user controlled by adjustable parameters.

ROFade = % radius of circle where black ring starts to fade out to regular view  
RMerge = % radius of circle where black ring becomes 100% black on inside edge  
RInner = % radius of circle where green NVG lens start to transition to black ring  
NOTE: if using render mode 1 nvg will only be size of RInner. ie size = RInner(percentage) * Eye_Size = actual size

– As per 2.0.4 DONT USE render mode 3, not implemented yet  
– Adjust variables in “\Frenchys NVG Mod 2.0.5\Bazar\shaders\common\MOD_nvg.hlsl” to change shape etc.

![NVG 2.0.5](http://damienstpierre.com/images/NVG/Screen_151109_233001.jpg)

* * *

### **Version 2.0.4**

– Download [**Here**](https://drive.google.com/open?id=0B1s7D5Bzv2DFeVF3NEVaMWRZaWc)  
– Included render mode setting, sets which NVG type to use. 0 = full screen, 1 = NVG with no ring, 2 = NVG with Ring, 3 = NVG with ring and slight zoom (not functional)  
– Render mode 2 is default.  
– As above DONT USE mode 3, not implemented yet  
– Adjust variables in “\Frenchys NVG Mod 2.0.4\Bazar\shaders\common\MOD_nvg.hlsl” to change shape etc.

![NVG 2.0.4](http://damienstpierre.com/images/NVG/render-modes.jpg)

* * *

### **Version 2.0.3**

– Download [**Here**](https://drive.google.com/open?id=0B1s7D5Bzv2DFeHZ2Rk1vTmhoT2s)  
– Include fade and ring at edge of lens, this is based off my own code and not Nrgizers. I understood what his code did but not how so I wrote my own version. It may not be the most efficient code??? but it works and I know how to troubleshoot it  
– Adjust variables in “\Frenchys NVG Mod 2.0.3\Bazar\shaders\common\MOD_nvg.hlsl” to change shape etc.  
– Minimal comments/instructions in code at the moment. Implementation is extremely similar to **V1.0…**

![NVG 2.0.3 -1](http://damienstpierre.com/images/NVG/Screen_151105_131046.jpg)

![NVG 2.0.3 -2](http://damienstpierre.com/images/NVG/Screen_151105_131232.jpg)

* * *

### **Version 2.0.2**

– Download [**Here**](https://drive.google.com/open?id=0B1s7D5Bzv2DFbFpoSzQzUmNVbEk)  
– Added user controlled parametric mask for shape, size and center point of NVG lens.  
– Removes reliance on mask.png  
– Doesn’t include fade or ring at edge of lens, this will be the focus of the next release.  
– Adjust variables in “\Frenchys NVG Mod 2.0.2\Bazar\shaders\common\MOD_nvg.hlsl” to change shape etc.  
– Minimal comments/instructions in code at the moment. Implementation is extremely similar to **V1.0…**

![NVG 2.0.2](http://damienstpierre.com/images/NVG/shape-comparison.jpg)

* * *

### **Version 2.0.1**

– Download [**Here**](https://drive.google.com/open?id=0B1s7D5Bzv2DFR01ZN2ZmVTRpS1E)  
– Updated Nrgizers mod [**here**](http://forums.eagle.ru/showthread.php?t=100333) to DX11 standard  
– JSMGE ready, just extract to your JSMGE folder.  
– Achieves same color, intensity and noise effects as Nrgizers for BOTH NATO AND RUSSIAN NVG.  
– Shape still relies on the focus.png file for mask, ring and size (main priority for next release is to have procedural mask user controls)  
– Lots of excess code, comments user variable parameters that currently have no effect.  
– Mod includes a large wide view focus.png If you dont like it UNAPPLY the mod and delete “\Frenchys NVG Mod 2.0.1\Bazar\Effects\PostEffects\focus.png” or rename to anything else and mod will use stock NVG field of view native to DCS 1.5

![NVG 2.0.1 -1](http://damienstpierre.com/images/NVG/compare-Nato-2.0.1.jpg)

![NVG 2.0.1 -2](http://damienstpierre.com/images/NVG/compare-russian-2.0.1.jpg)
