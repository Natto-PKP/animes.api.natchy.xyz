const generate = () => {
  const result = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
  return result.join('');
};

export default (ignore: string[]) => {
  let discriminator: string | undefined = generate();

  for (let i = 0; i < 10 && ignore.includes(discriminator); i += 1) {
    discriminator = generate();
  }

  return discriminator;
};
