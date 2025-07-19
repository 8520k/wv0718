const fs = require('fs');
const csv = require('csv-parser');

// JSON 객체들
const koData = {};
const enData = {};
const jpData = {};

// CSV 파일 읽기
fs.createReadStream('translate.csv')
  .pipe(csv())
  .on('data', (row) => {
    // 각 행에서 Key, ko, en 값을 추출
    const key = row.Key || row.key;
    const ko = row.ko;
    const en = row.en;
    const jp = row.jp;
    
    // 키가 존재하고 비어있지 않으면 추가
    if (key && key.trim()) {
      koData[key] = ko || '';
      enData[key] = en || '';
      jpData[key] = jp || '';
    }
  })
  .on('end', () => {
    // languages 폴더 생성
    if (!fs.existsSync('languages')) {
      fs.mkdirSync('languages');
    }
    if (!fs.existsSync('languages/ko')) {
      fs.mkdirSync('languages/ko');
    }
    if (!fs.existsSync('languages/en')) {
      fs.mkdirSync('languages/en');
    }
    
    // JSON 파일 생성
    fs.writeFileSync('languages/ko/main.json', JSON.stringify(koData, null, 2), 'utf8');
    fs.writeFileSync('languages/en/main.json', JSON.stringify(enData, null, 2), 'utf8');
    fs.writeFileSync('languages/jp/main.json', JSON.stringify(jpData, null, 2), 'utf8');
    
    console.log('✅ JSON 파일이 생성되었습니다:');
    console.log('- languages/ko/main.json');
    console.log('- languages/en/main.json');
    console.log('- languages/jp/main.json');
    console.log(`\n📊 통계:`);
    console.log(`- 한국어 항목: ${Object.keys(koData).length}개`);
    console.log(`- 영어 항목: ${Object.keys(enData).length}개`);
    console.log(`- 일본어 항목: ${Object.keys(jpData).length}개`);
  })
  .on('error', (error) => {
    console.error('❌ CSV 파싱 중 오류가 발생했습니다:', error);
  }); 