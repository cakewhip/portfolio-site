/** This is where the magic happens **/

/************************************************************************************/
//                                                                                  //
//                 &&&&&&                                                           //
//                        &&&&                                                      //
//   &&&&&&&&&&                &&                           &&&.                    //
//                #&&/             @                     &(    &                    //
//                      &&           &                 &      .,        &&.       & //
//                          &    &&&&&&&&&            &       &    /&            #* //
//                  &&&&&&&&&&&&&&&     &&&&&&&&&            &  &(              &   //
//                &&&&&&&&&&&&&&&&&&&&&&&&&&&*****,&*       &&#               &     //
//              &&&&&&&&**&&&&&&&&&&&&&&&&&&&********&     &               &&&&&(   //
//              &&&&&,****&&&&&&&&&&&&&&&&&&**********&  &                       &  //
//              &&*&******&&&&&&&&&&&&&&&&&***&* &****&&                        &   //
//             &*&**********&&&&&&&&&&&&&*,&&&  &*****&    &/****&&&.       &&      //
//           &&,/***********************&.   &(*******% &,******      .&&           //
//          &*%**********************&%  &&*******&&&&*******/#&       #**&         //
//         &*/*********************& &&********(&&&&**********(&&&&&&&*******&      //
//         #*&******************&&***********&&&&&&&********&&      ,&********(     //
//        &*&****************(&***********%&&&&&&&&&&&&**&&&&**      ,&&*****&.     //
//        &*&*************(&***********%&&&&&&&&&&&&&&&&&&&&&***&&       (**/       //
//         &%**********&&********#&&&&&&&&&&&&&&&&&&&&&&&&&&****(&&&                //
//           &*****&&  .&&&/***&&&&&&&&&&&&&&&&&&&&&&&&&&&&,****&&&&&               //
//                    /&*******&          *&&&&&&&&&&&&%*******&&&&&&               //
//                 &&&&&******/               ,&************,&&&&&&&&               //
//                &     &*****&*&             (&&&&&(**%&&&&&&&&&&&&&               //
//                 &  /&&*****&              &*&&&&&&&&&&&&&&&&&&&&*&               //
//                  & &*****&&#            &&&**%&&&&&&&&&&&&&&&***&&               //
//                     &&&                 &&&*********(%#********&&&               //
//                                         &&&&******************&&&&               //
//                                         @&&&&&&************&&&&&&                //
//                                          &&&&&&&&&&&&&&&&&&&&&&(                 //
//                                           &#&&&&&&&&&&&&&&&&&                    //
//                                          &******&&&&&&&&#                        //
//                                         &******&                                 //
//                                       &(***&%                                    //
//                                     &%*&/                                        //
//                                   &                                              //
//                                                                                  //
/************************************************************************************/

/**
 * For this site, I tried to keep the HTML as clean as possible. Meaning, it contained
 * purely textual information plus hints to the script for timing. You can see that it
 * contains mostly div and pre tags-- pre was used because p does not preserve white-
 * space. I changed this purely for the ASCII art. Each div that is to be typed out
 * is of class 'typed' and has an id. Furthermore, each pre tag can have the 'pause'
 * and 'type-speed' attributes. Pause is how long to pause after finishing the pre tag
 * and type-speed is how many milliseconds it takes to type each character.
 * 
 * Here is JS land, we start by first gathering all of our divs that will be typed.
 * Then we note their current heights, set it as their minimum, and then hide all of
 * their child pre tags. This is because as the text gets appended to the pre tag,
 * the div will size itself to the pre tags. By setting the minimum height, we are
 * able to maintain the spacing between divs and not get any stuttering text.
 * 
 * After it's done prepping the divs, it comes down to using the typeOutDiv function,
 * which accepts the ID of 'typed' class div and an optional callback. I use this
 * callback to first type out the intro div and then type the other divs in parallel
 * to each other.
 * 
 * The typeOutDiv function is mostly a wrapper, as it only grabs the element,
 * uses the 'getParas' function to collect child pre tags, and then feeds these
 * values to the recursive 'typeParas' function.
 * 
 * The typeParas function is recursive, and it also calls the 'recAddText' function
 * which is also recursive. In typeParas, it gathers the text and attributes for
 * the pre tag at the given index, and then uses the recAddText function to add
 * characters at a given speed. The recAddText function also accepts a callback
 * for when it finishes typing out the pre tag, which the typeParas function
 * uses to continue typing out the next pre tag.
 * 
 * Thanks for reading.
 */

prepDivs();

typeOutDiv('intro', () => {
    typeOutDiv('about-me');
    typeOutDiv('experience')
    typeOutDiv('gtri');
    typeOutDiv('ncr');
    typeOutDiv('ecodrop');
    typeOutDiv('skills');
    typeOutDiv('fun-facts');
});

function prepDivs() {
    let divs = document.getElementsByClassName('typed');

    for (let div of divs) {
        let divHeight = div.offsetHeight;
        div.style['min-height'] = divHeight;

        let paras = getParas(div);
        paras.forEach(para => {
            para.style['visibility'] = 'hidden';
        });
    }
}

function typeOutDiv(divId, callback) {
    let element = document.getElementById(divId);
    let paras = getParas(element);
    typeParas(paras, 0, callback);
}

function getParas(element) {
    let paras = [];

    element.childNodes.forEach(node => {
        if (node.nodeName === 'PRE') {
            paras.push(node);
        }
    });

    return paras;
}

/**
 * Given a list of pre tags, types out the pre tag at the given index
 * and then sets a resursive timeout to type out the rest of the pre tags.
 * After it's done typing out all the pre tags, it uses the callback (if available).
 */
function typeParas(paras, index, callback) {
    let para = paras[index];
    let text = para.textContent;

    text = text.replace('PIPE', '│');

    let typeSpeed = parseInt(getAttrib(para, 'type-speed', '0'));
    let pause = parseInt(getAttrib(para, 'pause', '100'));

    para.innerHTML = '';
    para.style.visibility = 'visible';

    recAddText(para, typeSpeed, text, 0, () => {
        setTimeout(() => {
            if (index < paras.length - 1) {
                typeParas(paras, index + 1, callback);
            } else {
                if (callback) {
                    callback.call();
                }
            }
        }, pause);
    });
}

/**
 * Recursively types out a given text inside of a given element.
 * Also uses a given type speed for timing purposes.
 * Callback is called when the text is done being typed.
 */
function recAddText(element, typeSpeed, text, index, callback) {
    // If type speed is 0, then we just type the whole line and leave
    if (typeSpeed === 0) {
        element.innerHTML = text;

        callback.call();

        return;
    }

    // Add next character
    element.innerHTML = text.substring(0, index);

    // If not done yet, set a recursive timeout for the next index
    // Else, use the callback
    if (index < text.length) {
        setTimeout(() => {
            recAddText(element, typeSpeed, text, index + 1, callback);
        }, typeSpeed);
    } else {
        callback.call();
    }
}

/**
 * Util function to grab an attribute from a given element with a fallback value.
 */
function getAttrib(element, attribName, fallback) {
    if (element.attributes[attribName]) {
        return element.attributes[attribName].value;
    } else {
        return fallback;
    }
}