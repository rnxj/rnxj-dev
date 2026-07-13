declare const Bun: {
  file(path: string | URL): {
    exists(): Promise<boolean>;
    text(): Promise<string>;
  };
  write(path: string | URL, data: string): Promise<number>;
};
