const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('should generate the correct message object', () => { // no need for done()
      var from = 'Vivi';
      var text = 'gup';
      var message = generateMessage(from, text);

      expect(typeof message.createdAt).toBe('number');
      // expect(message).toInclude({from, text}); // toInclude no longer works with newer version of expect
      // // alternative ways bellow:
      // // expect(message).toInclude({
      // //   from: from,
      // //   text: text
      // // });
      expect(message.from).toBe(from);
      expect(message.text).toBe(text);


    });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    var from = 'srg';
    var latitude = 222;
    var longitude = 333;
    var url = 'https://www.google.com/maps?q=222,333';
    var message = generateLocationMessage(from, latitude, longitude);

    expect(typeof message.createdAt).toBe('number');
    expect(message.from).toBe(from);
    expect(message.url).toBe(url);
  });
});
