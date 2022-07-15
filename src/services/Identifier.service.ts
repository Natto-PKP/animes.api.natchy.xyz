const characters = ['a', 'b', 'c', 'b', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'k', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default class Identifier {
  static generate() {
    const array = Array.from(
      { length: 8 },
      () => characters[Math.floor(Math.random() * characters.length)],
    );

    return array.join('');
  }
}
