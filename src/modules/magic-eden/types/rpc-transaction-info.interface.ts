export interface IRpcTransactionInfo {
  jsonrpc: '2.0';
  result: {
    blockTime: number;
    meta: {
      err: null | any;
      fee: number;
      innerInstructions: [
        {
          index: 0;
          instructions: [
            {
              accounts: [0, 2];
              data: '11112mKM3DB7QNzHW7AUJvvn8NrMPb3fbVjgauNqV6TRAwnRZVgyZQQA1s1hFiKL92AcER';
              programIdIndex: 3;
            },
            {
              accounts: [1, 0];
              data: 'bmawjv4rJea976wGPmMx1G5saPmQJ2i6VZAcVNYph9kyoRr';
              programIdIndex: 12;
            },
          ];
        },
      ];
      logMessages: string[];
      postBalances: number[];
      postTokenBalances: [
        {
          accountIndex: 1;
          mint: 'EjWnHeHGNz4mgros6sFgqoEbyKZhcGQvUexu2etCh56C';
          owner: '1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix';
          uiTokenAmount: {
            amount: '1';
            decimals: 0;
            uiAmount: 1;
            uiAmountString: '1';
          };
        },
      ];
      preBalances: [
        20500720,
        2039280,
        0,
        1,
        38972416568,
        5616720,
        898174080,
        100148958680,
        3654000,
        1461600,
        1141440,
        1009200,
        953185920,
      ];
      preTokenBalances: [
        {
          accountIndex: 1;
          mint: 'EjWnHeHGNz4mgros6sFgqoEbyKZhcGQvUexu2etCh56C';
          owner: '6oXVEAK7r8t1p4ZRHjpRyKHPiVFLe48Um8jT9tD29or1';
          uiTokenAmount: {
            amount: '1';
            decimals: 0;
            uiAmount: 1;
            uiAmountString: '1';
          };
        },
      ];
      rewards: [];
      status: {
        Ok: null;
      };
    };
    slot: 122694309;
    transaction: {
      message: {
        accountKeys: [
          '6oXVEAK7r8t1p4ZRHjpRyKHPiVFLe48Um8jT9tD29or1',
          '7rSxP1tNPKQN1wZd8RWPGEJjGkPJTZSqkx7CMJkWd2cC',
          'CkKkVnyZw2W4CHDgGsMkVr3RAAnNGw828j1ee7pqebcG',
          '11111111111111111111111111111111',
          '1BWutmTvYPwDtmw9abTkS4Ssr8no61spGAvW1X6NDix',
          '93UVifEx84sUJEaY1A84puxxA7idLN7BcgPseF8p9b2h',
          'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
          'autMW8SgBkVYeBgqYiTuJZnkvDZMVU2MHJh9Jh7CSQ2',
          'E8cU1WiRWjanGxmn96ewBgk9vPTcL6AEZ1t6F6fkgUWe',
          'EjWnHeHGNz4mgros6sFgqoEbyKZhcGQvUexu2etCh56C',
          'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K',
          'SysvarRent111111111111111111111111111111111',
          'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        ];
        header: {
          numReadonlySignedAccounts: 0;
          numReadonlyUnsignedAccounts: 10;
          numRequiredSignatures: 1;
        };
        instructions: [
          {
            accounts: [0, 3, 1, 1, 9, 5, 7, 8, 2, 7, 12, 3, 6, 4, 11];
            data: '2B3vSpRNKZZWu2Tat8sQRKtrUV5sRm1zA3SMJD2NNSrV5Rp';
            programIdIndex: 10;
          },
        ];
        recentBlockhash: '3mYmHsPTLGp9z7AvaSvhNDrqh68gbvjZsBzijMw6DTRk';
      };
      signatures: [
        '4QY1X22crC6K1PLToyhonz23VR8orJguKuRhDZGGXkuHrpD413ozw7vWoyin2GuipTkQhm4dBTc4GKgUdfjBZ97f',
      ];
    };
  };
  id: 1;
}
