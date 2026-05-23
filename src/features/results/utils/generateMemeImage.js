const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 675;
const TEXT_PADDING_RATIO = 0.06;

const TEXT_COLOR_MAP = {
  white: "#ffffff",
  black: "#151515",
  yellow: "#fff275",
};

const OUTLINE_COLOR_MAP = {
  black: "#000000",
  white: "#ffffff",
  none: "transparent",
};

const FONT_FAMILY_MAP = {
  classic: "Impact, Haettenschweiler, 'Arial Black', sans-serif",
  bold: "Inter, ui-sans-serif, system-ui, sans-serif",
  clean: "Inter, ui-sans-serif, system-ui, sans-serif",
};

const FONT_WEIGHT_MAP = {
  classic: 900,
  bold: 900,
  clean: 800,
};

function wrapText(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  });

  if (current) {
    lines.push(current);
  }
  return lines;
}

function drawMemeText(ctx, text, { yAnchor, anchor, fillColor, strokeColor, fontSize, maxWidth }) {
  ctx.textAlign = "center";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(6, Math.round(fontSize * 0.12));

  const lines = wrapText(ctx, text, maxWidth);
  const lineHeight = fontSize * 1.05;
  const blockHeight = lineHeight * lines.length;
  const startY =
    anchor === "bottom" ? yAnchor - blockHeight + lineHeight : yAnchor;

  ctx.textBaseline = "alphabetic";
  lines.forEach((line, index) => {
    const ly = startY + index * lineHeight;
    if (strokeColor !== "transparent") {
      ctx.strokeStyle = strokeColor;
      ctx.strokeText(line, CANVAS_WIDTH / 2, ly);
    }
    ctx.fillStyle = fillColor;
    ctx.fillText(line, CANVAS_WIDTH / 2, ly);
  });
}

export async function generateMemeImage({
  image,
  topText,
  bottomText,
  textColor,
  outlineColor,
  positionMode,
  fontStyle,
}) {
  if (!image?.previewUrl) {
    throw new Error("Missing image preview URL");
  }

  const img = await new Promise((resolve, reject) => {
    const element = new Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("Failed to load source image"));
    element.crossOrigin = "anonymous";
    element.src = image.previewUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#111111";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  const sourceAR = img.width / img.height;
  const targetAR = CANVAS_WIDTH / CANVAS_HEIGHT;
  let drawWidth;
  let drawHeight;
  let drawX;
  let drawY;
  if (sourceAR > targetAR) {
    drawWidth = CANVAS_WIDTH;
    drawHeight = CANVAS_WIDTH / sourceAR;
    drawX = 0;
    drawY = (CANVAS_HEIGHT - drawHeight) / 2;
  } else {
    drawHeight = CANVAS_HEIGHT;
    drawWidth = CANVAS_HEIGHT * sourceAR;
    drawX = (CANVAS_WIDTH - drawWidth) / 2;
    drawY = 0;
  }
  ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

  const fillColor = TEXT_COLOR_MAP[textColor] ?? "#ffffff";
  const strokeColor = OUTLINE_COLOR_MAP[outlineColor] ?? "#000000";
  const fontFamily = FONT_FAMILY_MAP[fontStyle] ?? FONT_FAMILY_MAP.classic;
  const fontWeight = FONT_WEIGHT_MAP[fontStyle] ?? FONT_WEIGHT_MAP.classic;
  const fontSize = Math.round(CANVAS_HEIGHT * 0.1);

  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  const showTop = positionMode !== "bottom-only" && topText;
  const showBottom = positionMode !== "top-only" && bottomText;
  const maxTextWidth = CANVAS_WIDTH * 0.9;
  const topY = CANVAS_HEIGHT * TEXT_PADDING_RATIO + fontSize;
  const bottomY = CANVAS_HEIGHT * (1 - TEXT_PADDING_RATIO);

  if (showTop) {
    drawMemeText(ctx, topText, {
      yAnchor: topY,
      anchor: "top",
      fillColor,
      strokeColor,
      fontSize,
      maxWidth: maxTextWidth,
    });
  }

  if (showBottom) {
    drawMemeText(ctx, bottomText, {
      yAnchor: bottomY,
      anchor: "bottom",
      fillColor,
      strokeColor,
      fontSize,
      maxWidth: maxTextWidth,
    });
  }

  return canvas.toDataURL("image/png");
}
