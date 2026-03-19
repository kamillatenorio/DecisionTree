let currentSlideIndex = 0;
const slides = document.querySelectorAll(".slide");
const prevArrow = document.getElementById('prev');
const nextArrow = document.getElementById('next');

// Show the current slide based on index
function showSlide(index) {
    if (index >= slides.length) {
        currentSlideIndex = slides.length - 1; // Prevent going past the last slide
    } else if (index < 0) {
        currentSlideIndex = 0; // Prevent going past the first slide
    } else {
        currentSlideIndex = index;
    }

    // Hide all slides
    slides.forEach((slide) => {
        slide.style.display = "none";
    });

    // Show the current slide
    slides[currentSlideIndex].style.display = "flex";

    // Hide the "Prev" arrow on the first slide
    if (currentSlideIndex === 0) {
        prevArrow.style.display = 'none';
    } else {
        prevArrow.style.display = 'block';
    }

    // Check if it's the last slide
    if (currentSlideIndex === slides.length - 1) {
        nextArrow.textContent = "-›"; // Change Next button text
        nextArrow.onclick = () => {
            if (typeof navigateWithFullscreen === "function") {
                navigateWithFullscreen("game.html"); // Redirect to game.html while keeping fullscreen preference
            } else {
                window.location.href = "game.html";
            }
        };
    } else {
        nextArrow.textContent = "›"; // Restore the default Next arrow
        nextArrow.onclick = () => changeSlide(1); // Continue to the next slide
    }
}

// Initialize the first slide and arrows
showSlide(currentSlideIndex);

// Change slide when clicking next/prev buttons
function changeSlide(step) {
    showSlide(currentSlideIndex + step);
}

function checkAnswerSlide4() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    const feedback4 = document.getElementById('feedback-4'); // Ensure feedback element is selected

    if (!selectedAnswer) {
    feedback4.innerHTML = "Please select an answer!";
        feedback4.style.display = "block";
        return;
    }

    if (selectedAnswer.value === "A") {
        feedback4.innerHTML = "Correct! Features are properties/characteristics of things that we as humans can describe. Examples of features are gender, hair color, and height.";
        feedback4.style.display = "block";
        nextArrow.style.display = "block"; // Show the next arrow so they can continue
    } else {
        feedback4.innerHTML = `Wrong! The correct answer is: Features. Features are properties/characteristics of things that we as humans can describe. Examples of features are gender, hair color, and height.`;
        feedback4.style.display = "block";
    }
}

function checkAnswerSlide6() {
    const selectedAnswer = document.querySelector('input[name="solution"]:checked');
    const feedback6 = document.getElementById('feedback-6'); // Ensure feedback element is selected

    if (!selectedAnswer) {
    feedback6.innerHTML = "Please select an answer!";
        feedback6.style.display = "block";
        return;
    }

    if (selectedAnswer.value === "B") {
        feedback6.innerHTML = "Correct! That's what we can do! We create a model based on the existing labeled data.";
        feedback6.style.display = "block";
        nextArrow.style.display = "block"; // Show the next arrow so they can continue
    } else {
        feedback6.innerHTML = "Wrong! We create a model based on the existing labeled data.";
        feedback6.style.display = "block";
    }
}
