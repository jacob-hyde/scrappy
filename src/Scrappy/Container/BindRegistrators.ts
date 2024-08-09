import { Container, Token, tagged, injected, OptionalToken } from "brandi";
import {
  Classes,
  Tokens,
  DefaultInterfaceImplementations,
} from "./Registrators";

interface TokenMap {
  [key: string]: Token<any>;
}

const bindRegistrators = (container: Container) => {
  for (const [token, implementation] of DefaultInterfaceImplementations) {
    container.bind(token).toInstance(implementation).inSingletonScope();
  }

  for (const key in Tokens) {
    if (Classes.has(key)) {
      const classOptions = Classes.get(key);

      if (classOptions!.hasOwnProperty("tokens")) {
        injected(
          classOptions!.class,
          ...(classOptions!.tokens!.map(
            (token) => token
          ) as unknown as OptionalToken<unknown>[])
        );
      }

      container
        .bind((Tokens as TokenMap)[key])
        .toInstance(classOptions!.class)
        .inSingletonScope();

      if (classOptions!.hasOwnProperty("tags")) {
        for (const tag of Classes.get(key)!.tags!) {
          if (tag.callback(container)) {
            const classOptions = Classes.get(key);
            tagged(classOptions!.class, tag.tag);
            const instanceBinding = container
              .when(tag.tag)
              .bind(tag.bind)
              .toInstance(tag.instance);
            if (classOptions!.singleton) {
              instanceBinding.inSingletonScope();
            } else {
              instanceBinding.inTransientScope();
            }
          }
        }
      }
    }
  }
};

const getRegistrator = <T>(container: Container, token: string): T => {
  if (!(Tokens as TokenMap).hasOwnProperty(token)) {
    throw new Error(`Token ${token} not found`);
  }

  return container.get((Tokens as TokenMap)[token]);
};

export { bindRegistrators, getRegistrator };
