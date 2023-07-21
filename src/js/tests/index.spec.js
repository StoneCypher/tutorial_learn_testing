const index  = require('../index.js'),
      square = index.square;

describe('square', () => {

  test('square of 0 is 0',       () => expect(    square(0) ).toBe(0)    );
  test('square of 3 is 9',       () => expect(    square(3) ).toBe(9)    );
  test('square of -3 is 9',      () => expect(   square(-3) ).toBe(9)    );
  test('square of 1.5 is 2.25',  () => expect(  square(1.5) ).toBe(2.25) );
  test('square of -1.5 is 2.25', () => expect( square(-1.5) ).toBe(2.25) );

});
