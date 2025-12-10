document.addEventListener("DOMContentLoaded", () => {

  // PLUS BUTTON
  document.querySelectorAll(".plusBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      let id = btn.getAttribute("data-id");
      let color = btn.getAttribute("data-color");

      let input = btn.parentElement.querySelector(".quantityInput");
      let quantity = parseInt(input.value) + 1;

      input.value = quantity; // update UI number immediately

      await updateQuantity(id, color, quantity); // update DB
      
      // RELOAD PAGE to recalculate prices
      window.location.reload(); 
    });
  });

  // MINUS BUTTON
  document.querySelectorAll(".minusBtn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      let id = btn.getAttribute("data-id");
      let color = btn.getAttribute("data-color");

      let input = btn.parentElement.querySelector(".quantityInput");
      let quantity = parseInt(input.value);

      if (quantity > 1) {
        quantity--; // avoid going below 1
        input.value = quantity; // update UI
        
        await updateQuantity(id, color, quantity); // update DB

        // RELOAD PAGE to recalculate prices
        window.location.reload();
      }
    });
  });

});

// API CALL FUNCTION
async function updateQuantity(productId, color, quantity) {
  try {
    await fetch(`/cart/update/${productId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ color, quantity }),
    });
  } catch (error) {
    console.log("Update failed", error);
  }
}