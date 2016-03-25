# COXCORE Class / Module Manager

## cox.class.js
`cox.createClass`를 이용하여 Class 생성과 상속을 처리할 수 있다.

#### Method 
- `cox.each` : Callback 함수 배열 순회 호출 
- `cox.isArray` : 배열 체크 (`Array.isArray`가 없으면 대체 함수 사용)
- `cox.isFunction` : 함수 체크
- `cox.isString` : 문자열 체크
- `cox.isNull` : `null` 혹은 `undefined` 체크
- `cox.isObject` : Object 체크
- `cox.proxy` : Context가 지정된 함수 반환 (`Function.prototype.bind`가 없으면 대체 함수 사용)
- `cox.createObject` : 지정된 객체를 prototype으로 하는 Object 반환 (`Object.create`가 없으면 대체 함수 사용)
- `cox.isInstance` : Prototype chain을 사용하지 않는 옵션에서 Class 상속을 할 때 instance 체크 (`instanceof` 대체)
- `cox.createClass` : Class 생성


#### Link
- [**cox.class 도움말 보기**](https://github.com/coxcore/cox-class/wiki/cox.class.js)



## cox.module.js
`cox.define`으로 Module을 정의할 수 있으며, `cox.module`로 의존성이 처리된 상태에서 Module을 사용할 수 있다.

#### Method
- `cox.define` : Module 생성 함수로 Module 정의
- `cox.defineModule` : Module 정의
- `cox.module` : Module 반환 및 의존성 처리

#### Link
- [**cox.module 도움말 보기**](https://github.com/coxcore/cox-class/wiki/cox.module.js)



## cox.node.builder.js
`Grunt`나 `Gulp` 같은 Task Runner 없이 Module을 병합해준다.


#### 사용법

저장소 Root 경로의 `build.js`파일을 node로 실행한다.

```javascript
$ node build
```


#### Method
- `config` : Option을 설정한다.
- `build` : Module을 병합한 파일을 생성한다.

#### Link
- [**cox.node.builder 도움말 보기**](https://github.com/coxcore/cox-class/wiki/cox.node.builder.js)



## 참고
`cox.class`와 `cox.module`은 node에서 사용가능하다.

```javascript

require('{path}/cox.class');
require('{path}/cox.module');

// 전역변수 cox에 namespace 객체를 할당한다.
console.log(cox);

``` 
