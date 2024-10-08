const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength=15;
let checkCount=0;
handleSlider();
//set strength circle color to grey
setIndicator("#CCC")
//set passwordlength
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow

}


function getRndInteger(min, max) {
  // Ensure max is strictly greater than min
  if (max <= min) {
      throw new Error("max must be greater than min");
  }
  // Generate a random integer in the range [min, max)
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
       return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

//copyBTn works
async function copyContent() {
  try {
      // Check if the Clipboard API is available
      if (navigator.clipboard) {
          await navigator.clipboard.writeText(passwordDisplay.value);
          copyMsg.innerText = "Copied!";
      } else {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = passwordDisplay.value;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          copyMsg.innerText = "Copied!";
      }
  } catch (e) {
      // Log the error to understand what went wrong
      console.error("Failed  ", e);
      copyMsg.innerText = "Failed ";
  }

  // Show the copy message
  copyMsg.classList.add("active");

  // Hide the copy message after 2 seconds
  setTimeout(() => {
      copyMsg.classList.remove("active");
  }, 2000);
}



//shuffle password
function shufflePassword(array){
   //Fisher Yates Method
   
   for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
let str = "";
array.forEach((el) => (str += el));
return str;

}

//checkbox count everytime call
function handleCheckBoxChange(){
  checkCount=0;
  allCheckBox.forEach((checkbox)=>{
    if(checkbox.checked)
      checkCount++;
  })
  //special case
  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
}
// call checkbox eventlistner
allCheckBox.forEach((checkbox)=>{
  checkbox.addEventListener('change',handleCheckBoxChange);
})

//slider length change
inputSlider.addEventListener('input',(e)=>{
  passwordLength=e.target.value;
  handleSlider();
})
//copy content of input box if value present 
copyBtn.addEventListener('click',()=>{
  if(passwordDisplay.value)
    copyContent();
})
generateBtn.addEventListener('click',()=>{
   //none of the checkbox are selected
   if(checkCount<=0) return;
   if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
   }
   //lets start the journey to find new password
     console.log("starting");
   //remove old password
   password="";

   //lets put the stuff mentioned by checkboxes
  //  if(uppercaseCheck.checked){
  //   password+=generateUpperCase();
  //  }
  //  if(lowercaseCheck.checked){
  //   password+=generateLowerCase();
  //  }
  //  if(numbersCheck.checked){
  //   password+=generateRandomNumber();
  //  }
  //  if(symbolsCheck.checked){
  //   password+=generateSymbol();
  //  }

  let funcArr=[];
  if(uppercaseCheck.checked)
    funcArr.push(generateUpperCase);
  if(lowercaseCheck.checked)
    funcArr.push(generateLowerCase);
  if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);
  if(symbolsCheck.checked)
    funcArr.push(generateSymbol);
  
  console.log(funcArr);

  if (funcArr.length === 0) {
    console.error("Function array is empty.");
    return;
}
  //compulsary addition
  for(let i=0;i<funcArr.length;i++){
    password+=funcArr[i]();
  }
  console.log("compulusry");
  //remaing 
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
}
  console.log("remaing");

  //suffle password
  password=shufflePassword(Array.from(password));
  console.log("shuffle");

  //show in UI
  passwordDisplay.value=password;
  console.log("ui");
  //calculate password strength
  calcStrength();

})