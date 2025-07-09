/*:
 * @target MZ
 * @plugindesc 텍스트 이벤트에서 자동 줄바꿈을 지원합니다.
 * @author Perplexity
 *
 * @help
 * 이벤트 커맨드 "텍스트 표시"에서 입력한 텍스트의 실제 너비가
 * 메시지 윈도우의 너비를 넘으면 자동으로 줄바꿈이 삽입됩니다.
 *
 * 플러그인 명령이나 추가 설정은 없습니다.
 */

(() => {
  // 원본 메서드 백업
  const _Window_Message_createTextState = Window_Message.prototype.createTextState;

  Window_Message.prototype.createTextState = function(text, x, y, width) {
      // 자동 줄바꿈 처리
      let wrappedText = this.autoWordWrap(text);
      
      // 원본 메서드 호출
      const textState = _Window_Message_createTextState.call(this, wrappedText, x, y, width);
      return textState;
  };

  // 자동 줄바꿈 처리 메서드 추가
  Window_Message.prototype.autoWordWrap = function(text) {
      let wrappedText = '';
      let currentLine = '';
      let i = 0;

      // 사용 가능한 너비 계산 (패딩 제외)
      const maxWidth = this.contentsWidth();

      while (i < text.length) {
          let char = text[i];
          
          // 기존 줄바꿈 문자 처리
          if (char === '\n') {
              wrappedText += currentLine + '\n';
              currentLine = '';
              i++;
              continue;
          }
          
          // 이스케이프 시퀀스 건너뛰기 (일시적으로)
          if (char === '\\' && i + 1 < text.length) {
              let escapeCode = text.substr(i, 2);
              currentLine += escapeCode;
              i += 2;
              continue;
          }
          
          // 테스트용 줄에 문자 추가
          let testLine = currentLine + char;
          
          // 실제 텍스트 너비 측정 (이스케이프 코드 제외한 순수 텍스트만)
          let testLineForMeasure = testLine.replace(/\\[A-Z]\[\d+\]/g, '');
          let testWidth = this.textWidth(testLineForMeasure);
          
          if (testWidth > maxWidth && currentLine !== '') {
              // 현재 줄이 너무 길면 줄바꿈
              wrappedText += currentLine + '\n';
              currentLine = char;
          } else {
              currentLine += char;
          }
          i++;
      }
      
      // 마지막 줄 추가
      wrappedText += currentLine;
      
      return wrappedText;
  };
})();
