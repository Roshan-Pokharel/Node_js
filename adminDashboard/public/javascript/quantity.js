document.addEventListener('DOMContentLoaded', () => {
    // Select all cart button containers
    const quantityContainers = document.querySelectorAll('.flex.items-center.bg-slate-50');

    quantityContainers.forEach(container => {
        const minusBtn = container.querySelector('.minusBtn');
        const plusBtn = container.querySelector('.plusBtn');
        const input = container.querySelector('.quantityInput');

        if (!minusBtn || !plusBtn || !input) return;

        // Helper function to update cart
        const updateCart = async (productId, color, newQuantity) => {
            try {
                const response = await fetch(`/cart/update/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        color: color,
                        quantity: newQuantity
                    })
                });

                const result = await response.json();
                
                if (result.success) {
                    // Reload to update prices and totals securely
                    window.location.reload();
                } else {
                    alert('Failed to update quantity');
                }
            } catch (error) {
                console.error('Error updating cart:', error);
            }
        };

        // Minus Button Logic
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = minusBtn.dataset.id;
            const color = minusBtn.dataset.color;
            let currentQty = parseInt(input.value);

            if (currentQty > 1) {
                // Optimistically update UI
                input.value = currentQty - 1; 
                // Send request
                updateCart(productId, color, currentQty - 1);
            } else {
                // Optional: If quantity is 1, maybe ask to remove?
                // For now, do nothing or redirect to remove route
                window.location.href = `/cart/remove/${color}/${productId}`;
            }
        });

        // Plus Button Logic
        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = plusBtn.dataset.id;
            const color = plusBtn.dataset.color;
            let currentQty = parseInt(input.value);

            // Optimistically update UI
            input.value = currentQty + 1;
            // Send request
            updateCart(productId, color, currentQty + 1);
        });
    });
});