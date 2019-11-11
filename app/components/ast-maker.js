import Component from '@ember/component';
import { parse, print, types } from 'recast';
import jsc from '../utils/codeshift-api';
import { computed } from '@ember/object';

const j = types.builders; // eslint-disable-line

// Sample code to test
const _code = `let a = 1;
let b = 'hello';
let c = false;
const d = 2;
var e = true;
import { foo as bar } from 'lib';
hello(1, 'world', true, a);
this.hello(1, 'world', true, a);
hello.world(1, 'foo', true, a);
foo.bar.baz();
foo.bar.bax.baz(1, 'foo', true, a);
if(a === 1) {
console.log('true');
foo.bar();
} else {
console.log('false');
foo.baz();
}

let a = {
name: 'raja',
action: hello()
};
`;

export default Component.extend({

  code: _code,
  ast: computed('code', function() {
  let ast = parse(this.get('code'));
      return JSON.stringify(ast);
  }),
  nodeApi: computed('code', function() {
  let ast = parse(this.get('code'));

      // Build the jscodeshift api 
      let _ast = ast.program.body.map(node => {

        switch(node.type) {
          case 'VariableDeclaration':
            return jsc.variableDeclaration(node);

          case 'ImportDeclaration':
            return jsc.importDeclaration(node);

          case 'ExpressionStatement':
            return jsc.expressionStatement(node);

          case 'IfStatement':
            return jsc.ifStatement(node);

          default:
            console.log(node.type); // eslint-disable-line
            return '';
        }

      });

      return _ast.join('\n//-----------------------\n');


  }),
  output: computed('code', function() {
  let ast = parse(this.get('code'));
      const sampleCode = '';
      const outputAst = parse(sampleCode);  
      // Build the jscodeshift api 
      let _ast = ast.program.body.map(node => {

        switch(node.type) {
          case 'VariableDeclaration':
            return jsc.variableDeclaration(node);

          case 'ImportDeclaration':
            return jsc.importDeclaration(node);

          case 'ExpressionStatement':
            return jsc.expressionStatement(node);

          case 'IfStatement':
            return jsc.ifStatement(node);

          default:
            console.log(node.type); // eslint-disable-line
            return '';
        }

      });


      // Check the manifested api is working fine
      _ast.forEach(n => outputAst.program.body.push(eval(n)));

      const output = print(outputAst, { quote: 'single'}).code;

      return  output;



  }),
  init() {
    this._super(...arguments);
    this.set('jsonMode',{ name: "javascript", json: true });
  }


});
