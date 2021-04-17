# word-preprocessor

우리말셈 단어에서 ZUDA에서 사용할 수 있도록 가공합니다.

가공한 단어는 ZUDA 입장 코드 및 출석체크에 사용됩니다.

- 2글자 이상 단어만 사용합니다.
- 명사만 사용합니다.
- 특수문자가 들어간 단어는 사용하지 않습니다.

## 사용방법

1. 해당 스크립트는 [우리말샘](https://opendict.korean.go.kr/) 또는 [한국어기초사전](https://krdict.korean.go.kr/)의 엑셀 사전 정보를 바탕으로 작동됩니다.

2. `index.ts` 코드의 `WORD_COLUNM` 과 `WORD_PARTS` 변수를 통해 엑셀 컬럼명을 지정할 수 있습니다.

3. `ts-node ./index.ts [File Path]` 명령어를 통해 시작을 하며 결과는 `dist` 폴더에 생성됩니다.

## 라이센스

해당 소스 코드는 [MIT License](./LICENSE) 를 적용받습니다.

가공된 단어는 [크리에이티브 커먼즈 저작자표시-동일조건변경허락 2.0 대한민국 라이선스](https://creativecommons.org/licenses/by-sa/2.0/kr/) 를 적용받습니다.
