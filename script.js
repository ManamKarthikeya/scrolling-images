console.clear();

gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

// Set initial canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = 220;
const currentFrame = {
    frame: 1
};

// Function to format frame numbers pointing to the new folder 'background scrolling'
const currentImage = index => (
    `./background scrolling/${index.toString().padStart(4, '0')}.png`
);

const images = [];

// Preload the first image immediately to show something on screen
const firstImage = new Image();
firstImage.src = currentImage(1);
firstImage.onload = () => {
    render(firstImage);
    preloadImages();
};

// Preload the rest of the images
function preloadImages() {
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentImage(i);
        images.push(img);
    }
}

// Draw the image to the canvas, centering and scaling it to cover the screen
function render(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate aspect ratio
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    // use Math.max to simulate 'object-fit: cover'
    const ratio = Math.max(hRatio, vRatio);
    
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    context.drawImage(img, 0, 0, img.width, img.height,
                      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

// 1. Canvas scroll animation timeline
gsap.to(currentFrame, {
    frame: frameCount - 1,
    snap: "frame",
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.5
    },
    onUpdate: () => {
        if (images[currentFrame.frame]) {
            render(images[currentFrame.frame]);
        }
    }
});



// 3. Foreground Text Animations
const steps = document.querySelectorAll(".step");

steps.forEach((step) => {
    // If it's just a spacer, skip animation logic
    if (step.classList.contains('step-spacer')) return;

    const texts = step.querySelectorAll('.reveal-text-y');
    const line = step.querySelector('.scale-x');

    // Reveal text animation (slice effect sliding up)
    if (texts.length > 0) {
        gsap.fromTo(texts, 
            { y: 100, opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
            { 
                y: 0, 
                opacity: 1, 
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                duration: 1.2, 
                stagger: 0.15, 
                ease: "power4.out",
                scrollTrigger: {
                    trigger: step,
                    start: "top 70%",
                    end: "bottom 30%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    }

    // Line extension animation
    if (line) {
        gsap.fromTo(line,
            { scaleX: 0 },
            {
                scaleX: 1,
                duration: 1,
                delay: 0.4,
                ease: "power4.out",
                scrollTrigger: {
                    trigger: step,
                    start: "top 70%",
                    end: "bottom 30%",
                    toggleActions: "play reverse play reverse"
                }
            }
        );
    }
});

// Handle Window Resize to keep canvas size and render responsive
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (images[currentFrame.frame]) {
        render(images[currentFrame.frame]);
    } else {
        render(firstImage);
    }
});
