// Photo Optimization Script for NSMQ App
// You can use this in the browser console or as a Node.js script

// For browser (client-side optimization):
function optimizeImage(file, maxWidth = 800, quality = 0.8) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      
      // Set canvas size
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to blob
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
}

// Photo naming convention helper
const photoNamingGuide = {
  contestants: {
    format: "team-{year}.jpg",
    examples: [
      "team-2022.jpg",
      "team-2021.jpg", 
      "team-2020.jpg"
    ]
  },
  logos: {
    format: "{organization}-logo.{ext}",
    examples: [
      "nsmq-logo.png",
      "school-logo.png",
      "ghana-education-logo.png"
    ]
  },
  gallery: {
    format: "{event}-{description}.jpg",
    examples: [
      "competition-venue.jpg",
      "training-session.jpg",
      "awards-ceremony.jpg"
    ]
  }
};

// Image size recommendations
const imageSizeGuide = {
  hero: {
    width: 800,
    height: 600,
    format: "JPEG",
    quality: 0.85,
    maxSize: "300KB"
  },
  gallery: {
    width: 400,
    height: 300, 
    format: "JPEG",
    quality: 0.8,
    maxSize: "150KB"
  },
  logos: {
    width: 200,
    height: 200,
    format: "PNG",
    transparent: true,
    maxSize: "50KB"
  },
  thumbnails: {
    width: 150,
    height: 150,
    format: "JPEG", 
    quality: 0.75,
    maxSize: "25KB"
  }
};

// Batch resize function for multiple images
async function batchOptimizeImages(files, options = {}) {
  const {
    maxWidth = 800,
    quality = 0.8,
    format = 'jpeg'
  } = options;
  
  const optimizedFiles = [];
  
  for (let file of files) {
    const optimized = await optimizeImage(file, maxWidth, quality);
    optimizedFiles.push({
      original: file.name,
      optimized: optimized,
      sizeBefore: file.size,
      sizeAfter: optimized.size,
      savings: Math.round((1 - optimized.size / file.size) * 100)
    });
  }
  
  return optimizedFiles;
}

// Photo metadata helper
function generatePhotoMetadata(filename, description, year, people = []) {
  return {
    filename,
    description,
    year,
    people,
    uploadDate: new Date().toISOString(),
    alt: `${description} - ${year}`,
    caption: people.length > 0 ? `${people.join(', ')} - ${description}` : description
  };
}

// Example metadata for your photos:
const photoMetadata = [
  generatePhotoMetadata(
    "team-2022.jpg",
    "Western Zonal Championship Team",
    2022,
    ["Efua", "Doreen", "Wiesmes"]
  ),
  generatePhotoMetadata(
    "nsmq-logo.png", 
    "Official NSMQ Logo",
    2024
  ),
  generatePhotoMetadata(
    "school-logo.png",
    "APGSS Official Logo", 
    2024
  )
];

// Usage example in HTML:
/*
<input type="file" id="photoUpload" multiple accept="image/*">
<script>
document.getElementById('photoUpload').addEventListener('change', async (e) => {
  const files = Array.from(e.target.files);
  const optimized = await batchOptimizeImages(files, {
    maxWidth: 800,
    quality: 0.85
  });
  
  console.log('Optimization results:', optimized);
  
  // Download optimized images
  optimized.forEach((result, index) => {
    const url = URL.createObjectURL(result.optimized);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized-${result.original}`;
    a.click();
  });
});
</script>
*/

console.log("Photo optimization tools loaded!");
console.log("Usage: optimizeImage(file, maxWidth, quality)");
console.log("Batch: batchOptimizeImages(files, options)");
console.log("Naming guide:", photoNamingGuide);
console.log("Size guide:", imageSizeGuide);