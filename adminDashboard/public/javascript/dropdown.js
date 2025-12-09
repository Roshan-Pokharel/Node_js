document.querySelectorAll(".plusBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    // 1. Update the visible input (The number user sees)
    const displayInput = document.querySelector(`.quantityInput[data-id='${id}']`);
    let val = parseInt(displayInput.value);
    val = val + 1;
    displayInput.value = val;

    // 2. Update the HIDDEN input (The data sent to backend)
    const hiddenFormInput = document.querySelector(`.hiddenQty[data-id='${id}']`);
    if(hiddenFormInput) {
        hiddenFormInput.value = val;
    }
  });
});

document.querySelectorAll(".minusBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const displayInput = document.querySelector(`.quantityInput[data-id='${id}']`);
    const hiddenFormInput = document.querySelector(`.hiddenQty[data-id='${id}']`);
    
    let val = parseInt(displayInput.value);
    if (val > 1) {
      val = val - 1;
      displayInput.value = val;
      
      // Update the hidden input
      if(hiddenFormInput) {
          hiddenFormInput.value = val;
      }
    }
  });
});


