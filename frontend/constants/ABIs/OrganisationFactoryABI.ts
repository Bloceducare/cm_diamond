export const OrganisationFactoryABI = [
  { inputs: [], name: "ALREADY_INITIALIZED", type: "error" },
  { inputs: [], name: "UNAUTHORIZED_OPERATION", type: "error" },
  {
    inputs: [
      { internalType: "string", name: "_organisation", type: "string" },
      { internalType: "string", name: "_cohort", type: "string" },
      { internalType: "string", name: "_uri", type: "string" },
      { internalType: "string", name: "_adminName", type: "string" },
      { internalType: "address", name: "_relayer", type: "address" },
    ],
    name: "createorganisation",
    outputs: [
      { internalType: "address", name: "organisation", type: "address" },
      { internalType: "address", name: "Nft", type: "address" },
      { internalType: "address", name: "mentorsSpok", type: "address" },
      { internalType: "address", name: "certificate", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deployOrgDiamondFacet",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOrganizations",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_userAddress", type: "address" },
    ],
    name: "getUserOrganisatons",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_certificateFactory", type: "address" },
      {
        internalType: "address",
        name: "_createOrganisationFacet",
        type: "address",
      },
      {
        internalType: "address",
        name: "_deployOrgDiamondFacet",
        type: "address",
      },
      {
        internalType: "address",
        name: "_organisationsSelectorsFacet",
        type: "address",
      },
      {
        internalType: "address",
        name: "_otherSelectorsFacet",
        type: "address",
      },
    ],
    name: "initializeAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "address", name: "_address", type: "address" },
          { internalType: "string", name: "_name", type: "string" },
        ],
        internalType: "struct Individual[]",
        name: "_individual",
        type: "tuple[]",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address[]", name: "_individual", type: "address[]" },
    ],
    name: "revoke",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
