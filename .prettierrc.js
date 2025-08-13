module.exports = {
    plugins: ['prettier-plugin-tailwindcss'],
    printWidth: 100,
    trailingComma: 'all', // 기본값
    tabWidth: 2, // 탭간격
    semi: true, // 일부 코드에서 라인의 시작 부분에 세미 콜론 추가
    singleQuote: true, // 문자열의 경우 작은따옴표로.
    bracketSpacing: true, // 기본값. true인 경우 {foo:bar}는 { foo: bar }로 변환됨
    arrowParens: 'always', // 화살표함수에서 단일 매개변수를 사용시에 소괄호를 항상 넣도록
    useTabs: false, // 기본값
};
