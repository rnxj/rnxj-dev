declare const Bun: {
  file(path: string | URL): {
    text(): Promise<string>;
  };
  write(path: string | URL, data: string): Promise<number>;
};
