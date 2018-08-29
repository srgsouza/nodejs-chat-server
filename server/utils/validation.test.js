const expect = require('expect');

const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var num = isRealString(123);
    expect(num).toBeFalsy();
  });

  it('should reject string with only spaces', () => {
    var spaces = isRealString('   ');
    expect(spaces).toBe(false);
  });

  it('should allow string with non-space characters', () => {
    var good = isRealString('  SRg  ');
    expect(good).toBe(true);
  });
});

//
