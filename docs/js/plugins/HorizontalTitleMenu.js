/*:
 * @target MZ
 * @plugindesc 타이틀 메뉴를 가로 배치로 변경합니다.
 * @author Claude
 * @help
 * 타이틀 화면의 메뉴를 가로로 배치합니다.
 * 선택된 메뉴 아이템이 위아래로 부드럽게 움직입니다.
 */

(() => {
  "use strict";

  // 애니메이션 관련 프로퍼티 추가
  Window_TitleCommand.prototype.animationFrame = 0;
  Window_TitleCommand.prototype.animationSpeed = 0.05;
  Window_TitleCommand.prototype.animationAmplitude = 5;

  // 명령 개수 자동 계산
  Window_TitleCommand.prototype.maxCols = function () {
    return this._list && this._list.length ? this._list.length : 3;
  };

  Window_TitleCommand.prototype.numVisibleRows = function () {
    return 1;
  };

  Window_TitleCommand.prototype.windowWidth = function () {
    // 윈도우를 항상 넓게(예: 80%) 고정
    return Graphics.boxWidth * 0.8;
  };

  Window_TitleCommand.prototype.windowHeight = function () {
    const extra = 20; // 애니메이션 여유 공간 조정
    const height = this.itemHeight() + this.padding * 2 + extra;
    return height;
  };

  Window_TitleCommand.prototype.itemWidth = function () {
    return 220; // 고정 너비 150픽셀
  };

  Window_TitleCommand.prototype.itemHeight = function () {
    return 100; // 고정 높이 50픽셀
  };

  Window_TitleCommand.prototype.itemRect = function (index) {
    const rect = new Rectangle();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    const gap = 20; // 간격을 20픽셀로 증가
    const totalWidth = rect.width * this.maxCols() + gap * (this.maxCols() - 1);
    // 윈도우 내에서 메뉴 전체가 중앙에 오도록 offset 계산 (패딩 포함)
    const offsetX =
      (this.windowWidth() - this.padding * 2 - totalWidth) / 2 + this.padding;
    rect.x = offsetX + index * (rect.width + gap);
    rect.y = 10; // 중앙 정렬을 위해 조정
    return rect;
  };

  // 창 위치 중앙 정렬 및 크기 재설정
  const _updatePlacement = Window_TitleCommand.prototype.updatePlacement;
  Window_TitleCommand.prototype.updatePlacement = function () {
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = Graphics.boxHeight - this.height - 100;
  };

  // 커맨드 리스트가 갱신될 때마다 크기 재설정
  const _makeCommandList = Window_TitleCommand.prototype.makeCommandList;
  Window_TitleCommand.prototype.makeCommandList = function () {
    _makeCommandList.call(this);
    
    // 세이브 데이터가 없으면 "이어하기" 메뉴 제거
    if (!DataManager.isAnySavefileExists()) {
      this._list = this._list.filter(command => command.symbol !== 'continue');
    }
    
    this.width = this.windowWidth();
    this.height = this.windowHeight();
    this.createContents();
  };

  // 타이틀 커맨드 윈도우의 배경, 테두리, 커서 모두 투명하게
  const _Window_TitleCommand_initialize =
    Window_TitleCommand.prototype.initialize;
  Window_TitleCommand.prototype.initialize = function (rect) {
    _Window_TitleCommand_initialize.call(this, rect);
    this.opacity = 0; // 윈도우 전체 투명
    this.backOpacity = 0; // 배경 투명
    this.contentsOpacity = 255; // 텍스트는 보이게
  };

  Window_TitleCommand.prototype.standardBackOpacity = function () {
    return 0;
  };

  Window_TitleCommand.prototype.updateTone = function () {
    // 아무것도 하지 않음 (톤 효과 제거)
  };

  Window_TitleCommand.prototype._refreshFrame = function () {
    // 테두리 그리지 않음
  };

  Window_TitleCommand.prototype._refreshCursor = function () {
    // 커서 그리지 않음
  };

  Window_TitleCommand.prototype._refreshPauseSign = function () {
    // 일시정지 표시 그리지 않음
  };

  Window_TitleCommand.prototype._refreshArrows = function () {
    // 스크롤 화살표 그리지 않음
  };

  // 아이템 배경 이미지 그리기 메서드로 교체
  Window_TitleCommand.prototype.drawItemBackground = function (x, y, width, height) {
    const bitmap = ImageManager.loadSystem("ticket");
    if (bitmap.isReady()) {
      this.contents.blt(
        bitmap,
        0,
        0,
        bitmap.width,
        bitmap.height,
        x,
        y,
        width,
        height
      );
    } else {
      bitmap.addLoadListener(() => this.refresh());
    }
  };

  // 애니메이션 프레임 업데이트
  const _Window_TitleCommand_update = Window_TitleCommand.prototype.update;
  Window_TitleCommand.prototype.update = function () {
    _Window_TitleCommand_update.call(this);
    this.animationFrame += this.animationSpeed;
    if (this.animationFrame >= Math.PI * 2) {
      this.animationFrame = 0;
    }
    this.refresh();
  };

  // 화살표 그리기 메서드 추가
  Window_TitleCommand.prototype.drawArrow = function (x, y, size = 20) {
    const context = this.contents.context;
    context.save();
    context.beginPath();
    context.moveTo(x, y - size / 2);
    context.lineTo(x + size, y);
    context.lineTo(x, y + size / 2);
    context.closePath();
    // 테두리 설정
    // context.lineWidth = 3;
    context.strokeStyle = "#000000";
    context.stroke();
    // 내부 채우기
    context.fillStyle = "#000000";
    context.fill();
    context.restore();
  };

  // SVG 아이콘 그리기 메서드 추가
  Window_TitleCommand.prototype.drawMenuIcon = function (
    x,
    y,
    width = 30,
    height = 40
  ) {
    const bitmap = ImageManager.loadSystem("menu_icon"); // img/system/menu_icon.svg
    if (bitmap.isReady()) {
      // 중심 정렬
      this.contents.blt(
        bitmap,
        0,
        0,
        bitmap.width,
        bitmap.height,
        x - width / 2,
        y - height / 2,
        width,
        height
      );
    } else {
      // 로딩 중이면 다음 프레임에 다시 시도
      bitmap.addLoadListener(() => this.refresh());
    }
  };

  // drawItem 메서드를 새로운 로직으로 교체
  const _Window_TitleCommand_drawItem = Window_TitleCommand.prototype.drawItem;
  Window_TitleCommand.prototype.drawItem = function (index) {
    const rect = this.itemRect(index);
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    const text = this.commandName(index);

    const prevOutlineWidth = this.contents.outlineWidth;
    const prevOutlineColor = this.contents.outlineColor;
    const prevFontSize = this.contents.fontSize;
    // 텍스트 테두리 제거
    this.contents.outlineWidth = 0;
    // 폰트 크기를 20으로 설정
    this.contents.fontSize = 30;
    // this.contents.outlineColor = "black";

    const yOffset = this.index() === index ? Math.sin(this.animationFrame) * this.animationAmplitude : 0;
    const itemY = rect.y + yOffset;

    // 1. 배경 그리기 (아이템 크기와 동일하게 150x50으로)
    this.drawItemBackground(rect.x, itemY, rect.width, rect.height);

    // 2. 텍스트와 아이콘 그리기
    const textWidth = this.textWidth(text);
    const textX = rect.x + (rect.width - textWidth) / 2;
    const textY = itemY + (rect.height - this.lineHeight()) / 2; // 수직 중앙 정렬

    // 텍스트 색상을 검은색으로 설정
    this.changeTextColor("black");

    if (this.index() === index) {
      const iconX = textX - 25; // 텍스트 왼쪽에 아이콘 위치
      const iconY = itemY + rect.height / 2; // 아이콘 수직 중앙 정렬
      this.drawMenuIcon(iconX, iconY);
    }
    
    this.drawText(text, textX, textY, textWidth, "left");

    this.contents.outlineWidth = prevOutlineWidth;
    this.contents.outlineColor = prevOutlineColor;
    this.contents.fontSize = prevFontSize;
  };

  const _Window_TitleCommand_select = Window_TitleCommand.prototype.select;
  Window_TitleCommand.prototype.select = function (index) {
    _Window_TitleCommand_select.call(this, index);
    this.refresh(); // 선택이 바뀔 때마다 전체를 다시 그림
  };
})();

// Scene_Title에서 타이틀 커맨드 윈도우 위치 강제 갱신
const _Scene_Title_createCommandWindow =
  Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function () {
  _Scene_Title_createCommandWindow.call(this);
  if (this._commandWindow && this._commandWindow.updatePlacement) {
    this._commandWindow.updatePlacement();
  }
};
