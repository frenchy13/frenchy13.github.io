---
layout: page
title: DIY – UH-1H Huey Collective for simming
# permalink: /collective/
---


Hey Everyone.

This started as a project where I built my own collective with the long term goal of selling a few. With university and work time constraints it was finally finished but I definitely didnt have time in the near future to make a product of a quality/finish I would be happy to sell. Therefor, because the Flight Sim community and in particular the guys at the  229th I thought I would share how I made it.  
This is a DIY project with the idea in mind that anyone with a drill, hacksaw, soldering iron and internet connection can build. I had originally built it with a few joins using epoxy but after about 6 months use they started to slip. I then got a friend to do a quick 2 minute weld on the one join and now its as strong as ever.

It does require a few semi expensive parts though (if you want it to look pretty). The 4 critical parts are:  
– the hat switch with the coolie hat on it, ($20 AUD)  
– black anodized panels that the switches are mounted to, ($60 AUD laser engraved, much cheaper if people buy together)  
– 3D printed head unit that the panels are mounted to. ($50 to $100 depending on source and quality)  
– Micro controller that interfaces with your computer  ($30 if you are willing to upload code (which i provide) to a Teensy board, $50 plus for leo bodnar alternative)

**THE CATCH:** I spent many hours teaching myself C++ code and AutoCAD to complete the files I have attached for you to use. If you use my files please consider making a small donation using the Paypal buttons further down this page.

## **PT 1 – Parts**

**Parts:**  
**Aluminium**  
For the following aluminium parts just go to your local supplier, For Victoria, Australia I used these guys: **[Aluminium supplier](http://www.whitepages.com.au/business-listing/just-aluminium-1264010/south-geelong-vic)**  
– Aluminium rod 10mm OD * 120mm (needs to be solid, not tubing)  
– Aluminium tube 25mm OD 3mm wall 500mm long  
– Aluminium tube 32mm OD 3mm wall 130mm long  
– Aluminium U channel W 100mm * H 50mm * T 6mm    160mm long  (3mm thickness will work as well, just need to be careful in construction. I was using interference fit bolts so went with 6mm to make sure they held)  
– Aluminium right angle W 25mm * H 25mm * T 1.6mm    300mm long (will be cut down to numerous smaller parts as mounting brackets etc)

– KP000 10mm self aligning pillow block ***2**           <span style="color: #000000;">[**10mm pillow block**](http://www.ebay.com.au/itm/10-mm-Self-Aligning-Pillow-Block-Ball-Bearing-KP000-Australian-Seller-/331328551127?pt=LH_DefaultDomain_15&hash=item4d24b878d7)    or      **[2 * KP000 Pillow block](http://www.ebay.com.au/itm/2pc-10mm-KP000-Mounted-Ball-Bearing-Block-KP-Serials-/281492884061?hash=item418a488a5d)**</span>

[![](http://i763.photobucket.com/albums/xx274/taccca/229th/Huey%20Collective/Design/th_pillow%20block%20specks.jpg)](http://s763.photobucket.com/user/taccca/media/229th/Huey%20Collective/Design/pillow%20block%20specks.jpg.html) [![10mm Pillow block](http://damienstpierre.com/blog/wp-content/uploads/2016/02/10mm-Pillow-block-e1456144389955-150x150.jpg)](http://damienstpierre.com/blog/wp-content/uploads/2016/02/10mm-Pillow-block-e1456144389955.jpg)

**Laser etched button panels:  
**<span style="line-height: 1.5;">– 1.6mm to 2mm thick black anodized aluminium.</span> **[PDF FILE](http://www.damienstpierre.com/downloads/Collective%20Button%20Panels.pdf)** <span style="line-height: 1.5;">for etching company (cuts are in red, etching is in black, there is also external measurements)</span><span style="line-height: 1.5;">These are expensive in 1 off runs; for the 2 panels was $62 AUD the cheapest I found from</span> [**these great guys**](http://www.graphicengraving.com.au/contactus.htm)<span style="line-height: 1.5;"> in oz who would also do a run of 5 for roughly $30 per set. </span><span style="color: #000000; line-height: 1.5;">I got quotes from about 15 places and most wanted over $120 AUD just for one set.</span>

[![Collective Head panels](http://damienstpierre.com/blog/wp-content/uploads/2016/02/Front-Panel-1-150x150.png)](http://damienstpierre.com/blog/wp-content/uploads/2016/02/Front-Panel-1.png)

**3D printed collective head boxes** (panels attached to front):  
– The **[DOWNLOAD](http://www.damienstpierre.com/downloads/Collective_STLs.rar)** consists of two .stl files; one for the top box and one for the main box. The .stl files are a format designed for 3D printing software that can be used by pretty much every printing company world wide. To view the stl files you can download an stl viewer **[here](http://www.freestlview.com/)** or from my own server **[here](http://www.damienstpierre.com/downloads/STLView.rar)**

[![UH-1h Collective - 3D model](http://damienstpierre.com/blog/wp-content/uploads/2016/02/Untitled1-150x150.jpg)](http://damienstpierre.com/blog/wp-content/uploads/2016/02/Untitled1.jpg) [![UH-1H collective head - partial assembly](http://damienstpierre.com/blog/wp-content/uploads/2016/02/IMG_1077-150x150.jpg)](http://damienstpierre.com/blog/wp-content/uploads/2016/02/IMG_1077.jpg)

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="paypal"><input name="cmd" type="hidden" value="_s-xclick">  
<input name="hosted_button_id" type="hidden" value="EAGM479JS3URL">

<table class="table table-hover">

<tbody>

<tr>

<td><input name="on0" type="hidden" value="Donation Choice">Donation Choice</td>

</tr>

<tr>

<td><select name="os0"><option value="I'm a student">I’m a student $10.00 AUD</option><option value="I'm working">I’m working $20.00 AUD</option><option value="I appreciate the time you put in">I appreciate the time you put in $40.00 AUD</option><option value="I game with a 40">I game with a 40″+ monitor $60.00 AUD</option></select></td>

</tr>

</tbody>

</table>

<input name="currency_code" type="hidden" value="AUD">  
<input alt="PayPal — The safer, easier way to pay online." name="submit" src="https://www.paypalobjects.com/en_AU/i/btn/btn_cart_LG.gif" type="image">  
![](https://www.paypalobjects.com/en_AU/i/scr/pixel.gif)

</form>

**<span style="color: #000000;">Buttons:</span>**  
<span style="color: #000000;">Buttons confused me for a bit with throws and poles, momentary vs latched etc but no need to worry. For nomenclatures sake a button position in brackets means momentary (ie will spring back to the center position when released) while not in brackets means latched (ie, will stay in position and would have to be physically shifted back to center position).</span>  
<span style="color: #000000;">Eg (On) – Off – On                    means (momentary ON) – center – latched ON</span>

<span style="color: #000000;">– (On)-Off-(On) with flat toggle * 1               [**(on)-off-(on) toggle**](http://au.element14.com/multicomp/1ms4t6b11m1qe/switch-spdt/dp/9473637)</span>  
<span style="color: #000000;">– On – On with round toggle * 1                    [**On-On**](http://au.element14.com/multicomp/1ms1t1b5m1qe/switch-spdt-2-0a-250v/dp/947337802) (also known as on-none-on since it doesnt have a center position)      </span>  
<span style="color: #000000;">– On – Off – On with round toggle * 2          [**On-Off-On toggle**](http://au.element14.com/multicomp/1ms3t1b5m1qe/switch-spdt-on-off-on-5a-28vdc/dp/947338602)</span>

<span style="color: #000000;">– push button (mom) * 1                                [**Mom push button**](http://au.element14.com/multicomp/r13-502a-05-b/switch-spst-3a-125v-solder/dp/1634622?Ntt=R13-502A-05-B)   (this simulates the throttle stop release, it wont actually physically lock the twist throttle but will engage the button in game)</span>

<span style="color: #000000;">  
**4 way button with china hat  
**There are a few ways to do this. The switch below is a grayhill 04A which is actually used in FAA approved joysticks, I found it much better to use something of this size and quality compared to weak little ones.  
1\. in US, buy whole thing together here **4way** </span>**[china hat](http://www.aircraftspruce.com/catalog/elpages/infinitygripaccess5.php?clickkey=63314) **<span style="color: #000000;">or from (infinity) </span>**[here](http://infinityaerospace.com/product/featured/military-style-stick-grips/#how-to-order) **<span style="color: #000000;">using his accessories order form a little bit down the page. He is a good guy with an awesome business that is good to support </span>  
<span style="color: #000000;">2\. in EU, buy whole thing here **[4way china hat EU](http://www.aircraftspruce.eu/infinity-switch-w--china-hat.htm)  
**3\. in AU buy the whole thing together from either of the above or:  
get just the switch from here **[grayhill 04A 4way button](http://www.x-on.com.au/DetailsPage.aspx?MFRN=Grayhill&MFR=04A&ID=egDu1zbcdhr+fiSkeOiimQ==)** and order just the china hat from infinity by putting a note in the accessory order form (he does it even though its not on the list, they are $1.05 each hat).                                     </span>

**<span style="color: #000000;">Other Electronics:  
</span>**  
<span style="color: #000000;">– Teensy 3.1                                             **[teensy 3.1](http://littlebirdelectronics.com.au/products/teensy-3-1)**          This a micro controller that will interface with your computer via USB. Arduino’s can be used as well but I like the smaller form factor of the teensy. A Leo bodnar board is probably the easiest but being a NERD I enjoyed programming the teensy from scratch. Dont worry I will include the code.</span>

– A1324LUA-T Hall effect sensor             **[A1324LUA sensor](http://au.element14.com/allegro-microsystems/a1324lua-t/ic-sensor-hall-effect--nw/dp/2336862) ** the A1325 or A1326 from the same family can also be used but they aren’t as sensitive. This will be used as the primary sensor for the collective so its good not to skimp.

<span style="color: #000000;">– 10k **LINEAR** potentiometer                 [**10k 9mm Lin pot**](http://www.jaycar.com.au/Passive-Components/Resistors/Potentiometers/10K-9mm-Square-Potentiometer-Linear-Single-Gang-(B)/p/RP8510)    (need a smaller one like this 9mm one, the 16mm and bigger are to big for what we need)</span>  
<span style="color: #000000;">– Protoboard                                            [**protoboard**](http://www.ebay.com.au/itm/10Pcs-DIY-Prototype-Paper-PCB-Universal-Experiment-Matrix-Circuit-Board-5x7cm-OK-/251730812866?hash=item3a9c535fc2)</span>

<span style="color: #000000;">– 16 core rainbow ribbon **1m**                  **[ribbon cable](http://www.jaycar.com.au/Wire%2C-Cable-%26-Accessories/Communication-Cable/IDC/Rainbow-Cable-16-Core/p/WM4516)**</span>  
<span style="color: #000000;">– 5*5*5mm rare earth magnet ***2**  [**rare earth magnets**](http://www.ebay.com.au/itm/27-Cube-Rare-Earth-Neodymium-Magnets-N50-5mm-x-5mm-x-5mm-/290916003382?hash=item43bbf1ee36)(its not a bad idea to get extra, these things are strong and disappear when stuck to tools etc, i also wouldn’t go any smaller)</span>

## **PT 2 – Design**

Attached are the plans for base unit, mains shaft and friction block. The measurements are based on using KP000 pillow blocks – spec sheet also attached.

As you will see I dont give a diameter for the holes in the top of the base unit; you should always pilot first with a small drill bit like 2mm and then expand out to the size you need for your bolts.

With the Main shaft hole (marked by angle hatch) I drilled the 4 corners out starting at 2mm and then going out to the biggest drill size my chuck could take. Hence I have marked the hole centers at the corners shifted inside. The fore-aft relationship between the Main shaft hole and the pillow block holes is critical for determining the angular range of motion for the main shaft. What is presented here is slightly conservative and the Main shaft hole can be filled out to refine the angle limits.

Also special attention needs to be payed to which side the cut out is made to allow the axle to run out into the friction block, The plans are drawn from a right perspective but the cutout goes on the LEFT side.

AS ALWAYS MEASURE ONCE CUT TWICE ![Smile](http://illiweb.com/fa/i/smiles/icon_smile.gif) all images can be clicked on for full size

[![](http://i763.photobucket.com/albums/xx274/taccca/229th/Huey%20Collective/Design/Collective%20Design-1-2.jpg)](http://s763.photobucket.com/user/taccca/media/229th/Huey%20Collective/Design/Collective%20Design-1-2.jpg.html)

[![](http://i763.photobucket.com/albums/xx274/taccca/229th/Huey%20Collective/Design/Collective%20Design-2.jpg)](http://s763.photobucket.com/user/taccca/media/229th/Huey%20Collective/Design/Collective%20Design-2.jpg.html)

[![](http://i763.photobucket.com/albums/xx274/taccca/229th/Huey%20Collective/Design/Collective%20Design-3.jpg)](http://s763.photobucket.com/user/taccca/media/229th/Huey%20Collective/Design/Collective%20Design-3.jpg.html)

Reference Images  
[![](http://i763.photobucket.com/albums/xx274/taccca/229th/Huey%20Collective/Design/th_pillow%20block%20specks.jpg)](http://s763.photobucket.com/user/taccca/media/229th/Huey%20Collective/Design/pillow%20block%20specks.jpg.html) [![](http://i763.photobucket.com/albums/xx274/taccca/229th/Huey%20Collective/th_Collective-1091.jpg)](http://s763.photobucket.com/user/taccca/media/229th/Huey%20Collective/Collective-1091.jpg.html) [![](http://i763.photobucket.com/albums/xx274/taccca/229th/Huey%20Collective/th_Collective-1093.jpg)](http://s763.photobucket.com/user/taccca/media/229th/Huey%20Collective/Collective-1093.jpg.html) [![](http://i763.photobucket.com/albums/xx274/taccca/229th/Huey%20Collective/th_Collective-1095.jpg)](http://s763.photobucket.com/user/taccca/media/229th/Huey%20Collective/Collective-1095.jpg.html) [![](http://i763.photobucket.com/albums/xx274/taccca/229th/Huey%20Collective/th_Collective-1098.jpg)](http://s763.photobucket.com/user/taccca/media/229th/Huey%20Collective/Collective-1098.jpg.html)

<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="paypal"><input name="cmd" type="hidden" value="_s-xclick">  
<input name="hosted_button_id" type="hidden" value="EAGM479JS3URL">

<table class="table table-hover">

<tbody>

<tr>

<td><input name="on0" type="hidden" value="Donation Choice">Donation Choice</td>

</tr>

<tr>

<td><select name="os0"><option value="I'm a student">I’m a student $10.00 AUD</option><option value="I'm working">I’m working $20.00 AUD</option><option value="I appreciate the time you put in">I appreciate the time you put in $40.00 AUD</option><option value="I game with a 40">I game with a 40″+ monitor $60.00 AUD</option></select></td>

</tr>

</tbody>

</table>

<input name="currency_code" type="hidden" value="AUD">  
<input alt="PayPal — The safer, easier way to pay online." name="submit" src="https://www.paypalobjects.com/en_AU/i/btn/btn_cart_LG.gif" type="image">  
![](https://www.paypalobjects.com/en_AU/i/scr/pixel.gif)

## **REFERENCE MATERIAL**

Using a universal joint and hall effect sensors to make a joystick – [pdf guide](http://www.damienstpierre.com/other/downloads/uni_stick.pdf) by Julian – [original](http://www.mycockpit.org/forums/content.php?r=88-Hall-Effects-Sensors-to-make-a-joystick)

DIY hall sensor mechanism thread – [thread link](http://simhq.com/forum/ubbthreads.php/topics/3225807/all/DIY_hall_sensor.html) by f15 sim

</form>
