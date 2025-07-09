Window_ScrollText.prototype.drawTextEx = function(text, x, y) {
  const textState = this.createTextState(text, x, y, this.innerWidth);
  textState.x = this.innerWidth - this.textWidth(text); // 우정렬
  this.processAllText(textState);
  return textState.outputWidth;
};