export const addWatermark = (file: File, watermarkText = "Aarfa Marine") => {
  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return reject("Could not get canvas context");

        const MAX_WIDTH = 1200;
        const scale = Math.min(1, MAX_WIDTH / img.width);

        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const fontSize = canvas.width / 30; 
        const opacity = 0.12; 
        const spacing = canvas.width / 3.5; 
        const angle = -30 * (Math.PI / 180);

        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle);

        for (let x = -canvas.width; x < canvas.width; x += spacing) {
          for (let y = -canvas.height; y < canvas.height; y += spacing) {
            ctx.fillText(watermarkText, x, y);
          }
        }

        ctx.restore();

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject("Canvas export failed");

            const watermarkedFile = new File(
              [blob],
              file.name.replace(/\.\w+$/, ".png"),
              { type: "image/png" }
            );

            resolve(watermarkedFile);
          },
          "image/png",
          0.85
        );
      };

      img.onerror = () => reject("Failed to load image");
      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
};
