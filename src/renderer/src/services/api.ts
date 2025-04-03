/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type LoginData = {
  user: {
    wallet: string
    password: string
  }
}

export type SubscriptionData = {
    subscription: {
        wallet: string
        subscriptionCode: string,
        subscriptionAddress: string,
        subscriptionPrice: string
    }
}

export type FeedbackData = {
    feedback: {
        wallet: string,
        sender: string,
        subject: string,
        message: string,
    }
}

export type SubscriptionReqData = {
    subscription: {
        external_customer_id: string
    }
}

export type SubscriptionUsageEventData = {
    event: {
        transaction_id: string
        external_customer_id: string
        filesize: string
    }
}

export type AccountsListData = object;

/** @example {"hostKey":"ed25519:0c920d0254011f1065eeb99aa909c644b991780c1155ce0aa34cce09e6eabdc9"} */
export type AccountsCreatePayload = object;

export type AccountsCreateData = object;

/** @example {"hostKey":"ed25519:0c920d0254011f1065eeb99aa909c644b991780c1155ce0aa34cce09e6eabdc9","exclusive":false,"duration":"1000"} */
export type LockCreatePayload = object;

export type LockCreateData = object;

/** @example {"lockID":13874228167312386000} */
export type UnlockCreatePayload = object;

export type UnlockCreateData = string;

/** @example {"host":"ed25519:0c920d0254011f1065eeb99aa909c644b991780c1155ce0aa34cce09e6eabdc9","amount":1000000} */
export type PostAccountsPayload = object;

export type PostAccountsData = string;

/** @example {"host":"ed25519:0c920d0254011f1065eeb99aa909c644b991780c1155ce0aa34cce09e6eabdc9","amount":1000000} */
export type UpdateCreatePayload = object;

export type UpdateCreateData = string;

/**
 * @example "{
 *     "host": "ed25519:0c920d0254011f1065eeb99aa909c644b991780c1155ce0aa34cce09e6eabdc9",
 * }"
 */
export type RequressyncCreatePayload = object;

export type RequressyncCreateData = string;

export type ResetdriftCreateData = string;

export type ContractsListData = object;

export type AlertsListData = any;

/** @example {"contract":{"Revision":{"ParentID":"fcid:73ba641471a92a14ec694b301d905656daadf63dbf8cb261833cd1a1578b6f04","UnlockConditions":{"Timelock":0,"PublicKeys":[{"Algorithm":"ed25519","Key":"ENim2sagtqV7if+28uHztT/srt9aXSrsJB+fJRUSI4Q="},{"Algorithm":"ed25519","Key":"oqQXuBGQDvZnbB/vLmJ0ZHRekRTTURA32Hw2+oIpG6o="}],"SignaturesRequired":2},"Filesize":0,"FileMerkleRoot":"h:0000000000000000000000000000000000000000000000000000000000000000","WindowStart":126,"WindowEnd":131,"Payout":"0","ValidProofOutputs":[{"Value":"16666666666666666666666666","Address":"addr:d4beaa23055aaef738074c56302bfcdd9cff173ef1f1f1b16cffc7c40fe3c81e119a4c04942a"},{"Value":"441285052982572071957200","Address":"addr:f7c1b26ecfe35c2a85a888796b3adca5f18714478ff75b6410c33ad4928535a23038db1cf8b4"}],"MissedProofOutputs":[{"Value":"16666666666666666666666666","Address":"addr:d4beaa23055aaef738074c56302bfcdd9cff173ef1f1f1b16cffc7c40fe3c81e119a4c04942a"},{"Value":"441285052982572071957200","Address":"addr:f7c1b26ecfe35c2a85a888796b3adca5f18714478ff75b6410c33ad4928535a23038db1cf8b4"},{"Value":"0","Address":"addr:000000000000000000000000000000000000000000000000000000000000000089eb0d6a8a69"}],"UnlockHash":"h:0323007ecae633b0d0a901e83a321313f50fa36135189cf6c46d40b2fd08651a","RevisionNumber":1},"Signatures":[{"ParentID":"h:73ba641471a92a14ec694b301d905656daadf63dbf8cb261833cd1a1578b6f04","PublicKeyIndex":0,"Timelock":0,"CoveredFields":{"WholeTransaction":false,"SiacoinInputs":null,"SiacoinOutputs":null,"FileContracts":null,"FileContractRevisions":[0],"StorageProofs":null,"SiafundInputs":null,"SiafundOutputs":null,"MinerFees":null,"ArbitraryData":null,"Signatures":null},"Signature":"gLpSJzlw4M3vsgauGgjuKP+4SOZAPR7DbubSlWVRa2q/BGYex+Qw1d7hsrz1vVIk7FFkcSM0t3lQrWsZFNPaDg=="},{"ParentID":"h:73ba641471a92a14ec694b301d905656daadf63dbf8cb261833cd1a1578b6f04","PublicKeyIndex":0,"Timelock":0,"CoveredFields":{"WholeTransaction":false,"SiacoinInputs":[],"SiacoinOutputs":[],"FileContracts":[],"FileContractRevisions":[0],"StorageProofs":[],"SiafundInputs":[],"SiafundOutputs":[],"MinerFees":[],"ArbitraryData":[],"Signatures":[]},"Signature":"zdp5r0P97mX0a5L6XU399xIlJ/OM2PFcItsdAMForEkZMBxe8G3EVEVXf5vKfA+XOcrEBqxY3gPHldNlM+bkDw=="}]},"startHeight":53,"totalCost":"16666666666666666666666666"} */
export type ContractCreatePayload = object;

export type ContractCreateData = object;

export type ContractDetailData = object;

export type ContractDeleteData = string;

/** @example {"duration":"10000","priority":10} */
export type AcquireCreatePayload = object;

export type AcquireCreateData = object;

/** @example {"lockID":609920465282217500} */
export type ReleaseCreatePayload = object;

export type ReleaseCreateData = string;

export type AncestorsDetailData = object;

/** @example {"contract":{"Revision":{"ParentID":"fcid:269fea22643fb4651df94c83bdbdb7c62eaf86b9b5be145c6767a358ba946f45","UnlockConditions":{"Timelock":0,"PublicKeys":[{"Algorithm":"ed25519","Key":"SBQ/0x7UJ1zapagmuepGKmMwcVjwsmnjlIOzxxDvaE4="},{"Algorithm":"ed25519","Key":"fNaE03Jrt0pAm79/+vmFOhb/oMTe0nixcr+qKrAyxfM="}],"SignaturesRequired":2},"Filesize":0,"FileMerkleRoot":"h:0000000000000000000000000000000000000000000000000000000000000000","WindowStart":176,"WindowEnd":181,"Payout":"0","ValidProofOutputs":[{"Value":"16666666666666666666666666","Address":"addr:2ad815dbdd945019c7f6e9391b49312c8d77bcf8c658288b50ba3a1ea6504ea973586aedc22c"},{"Value":"533069390249021689235728","Address":"addr:511a06c313561ba094be3869e4106ac99fd20ddc2dbfdd8b7bbc46be38b0eec5a62dd9cb2858"}],"MissedProofOutputs":[{"Value":"16666666666666666666666666","Address":"addr:2ad815dbdd945019c7f6e9391b49312c8d77bcf8c658288b50ba3a1ea6504ea973586aedc22c"},{"Value":"533069390249021689235728","Address":"addr:511a06c313561ba094be3869e4106ac99fd20ddc2dbfdd8b7bbc46be38b0eec5a62dd9cb2858"},{"Value":"0","Address":"addr:000000000000000000000000000000000000000000000000000000000000000089eb0d6a8a69"}],"UnlockHash":"h:655d25079aa409467e79ec528db1ea4ebbb3617b12d6377eb2a4cc5d183180ba","RevisionNumber":1},"Signatures":[{"ParentID":"h:269fea22643fb4651df94c83bdbdb7c62eaf86b9b5be145c6767a358ba946f45","PublicKeyIndex":0,"Timelock":0,"CoveredFields":{"WholeTransaction":false,"SiacoinInputs":null,"SiacoinOutputs":null,"FileContracts":null,"FileContractRevisions":[0],"StorageProofs":null,"SiafundInputs":null,"SiafundOutputs":null,"MinerFees":null,"ArbitraryData":null,"Signatures":null},"Signature":"+G+SK4meJ8xg3KGu/mk1JqVjXtloAO3bSNz3ZrA4TQ0cWYuNkANtY6e6sIqOZqYni7hP3rmWLhrY4W2z34e9Aw=="},{"ParentID":"h:269fea22643fb4651df94c83bdbdb7c62eaf86b9b5be145c6767a358ba946f45","PublicKeyIndex":0,"Timelock":0,"CoveredFields":{"WholeTransaction":false,"SiacoinInputs":[],"SiacoinOutputs":[],"FileContracts":[],"FileContractRevisions":[0],"StorageProofs":[],"SiafundInputs":[],"SiafundOutputs":[],"MinerFees":[],"ArbitraryData":[],"Signatures":[]},"Signature":"+G+SK4meJ8xg3KGu/mk1JqVjXtloAO3bSNz3ZrA4TQ0cWYuNkANtY6e6sIqOZqYni7hP3rmWLhrY4W2z34e9Aw=="}]},"renewedFrom":"fcid:cb2d808860e482a9fa7fd2374507240c4114221af04001cf61edba605b1b5774","startHeight":102,"totalCost":"16666666666666666666666666"} */
export type RenewedCreatePayload = object;

export type RenewedCreateData = object;

export type DeleteContractsData = string;

export type SetsListData = object;

export type GetContractsData = object;

/** @example ["fcid:93c26cb56eb1048da7582f0f929415389a8352ca91cece7b2885297e5d5703a7","fcid:76db85736f888e8d5715124de37d0bcef81b2ae2cac2155aa8b8c64103e5a434"] */
export type PutContractsPayload = object;

export type PutContractsData = string;

export type DeleteContracts2Data = string;

/** @example {"contractID":"fcid:76db85736f888e8d5715124de37d0bcef81b2ae2cac2155aa8b8c64103e5a434","uploads":100,"downloads":100,"fundAccount":100} */
export type SpendingCreatePayload = object;

export type SpendingCreateData = string;

/** @example {"ParentID":"bid:56e4d337f8554ce34071743b1976e164da01728d824b4963761154c965fb5625","Nonce":0,"Timestamp":"2023-03-31T10:39:58+02:00","MinerPayouts":[{"Value":"299999000000000000000000000000","Address":"addr:162a2c565d0c10997ad21697c78c80688807296b09ea599f402c2304730ee6f67563d7c53145"}],"Transactions":[{"SiacoinInputs":[],"SiacoinOutputs":[],"FileContracts":[],"FileContractRevisions":[],"StorageProofs":[],"SiafundInputs":[],"SiafundOutputs":[],"MinerFees":[],"ArbitraryData":["Tm9uU2lhAAAAAAAAAAAAADuAtj8zRWfR3ulRHvz7fb0="],"Signatures":[]}]} */
export type AcceptblockCreatePayload = object;

export type AcceptblockCreateData = string;

export type StateListData = object;

export type SiafundfeeDetailData = object;

export type HostDetailData = object;

export type HostsListData = object;

/** @example {"offset":0,"limit":-1,"filterMode":"all"} */
export type HostsCreatePayload = object;

export type HostsCreateData = object;

/** @example {"add":[],"remove":["ed25519:6f7ac63891fa2eadeb3031b75817a4beaae91070f485c3d139f1ffd3107d6aa8"],"clear":false} */
export type AllowlistUpdatePayload = object;

export type AllowlistUpdateData = string;

export type AllowlistListData = object;

/** @example {"add":[],"remove":["siacentral.ddnsfree.com","siacentral.mooo.com","51.158.108.244","45.148.30.56"],"clear":false} */
export type BlocklistUpdatePayload = object;

export type BlocklistUpdateData = string;

export type BlocklistListData = object;

/** @example [{"host":"ed25519:06acb590d5a3e9f17c5870284818ae0ce93aa02aeaee50b02e490233ff56aafc","result":{},"success":true,"timestamp":"2023-03-31T15:58:41.642196+02:00","type":"dial"},{"host":"ed25519:06acb590d5a3e9f17c5870284818ae0ce93aa02aeaee50b02e490233ff56aafc","result":{"Error":"","priceTable":{"uid":"c7472fa8abb18bd9c57039431b915cdd","validity":600000000000,"hostblockheight":93,"updatepricetablecost":"1","accountbalancecost":"1","fundaccountcost":"1","latestrevisioncost":"204800000000000100","subscriptionmemorycost":"1","subscriptionnotificationcost":"1","initbasecost":"100","memorytimecost":"1","downloadbandwidthcost":"100000000000000","uploadbandwidthcost":"100000000000000","dropsectorsbasecost":"1","dropsectorsunitcost":"1","hassectorbasecost":"1","readbasecost":"100","readlengthcost":"1","renewcontractcost":"100000000000000000","revisionbasecost":"0","swapsectorcost":"1","writebasecost":"100","writelengthcost":"1","writestorecost":"23148148148","txnfeeminrecommended":"10000000000000000000","txnfeemaxrecommended":"30000000000000000000","contractprice":"250000000000000000000000","collateralcost":"46296296296","maxcollateral":"5000000000000000000000000000","maxduration":12960,"windowsize":5,"registryentriesleft":262144,"registryentriestotal":262144},"settings":{"acceptingcontracts":true,"baserpcprice":"100","collateral":"46296296296","contractprice":"250000000000000000000000","downloadbandwidthprice":"100000000000000","ephemeralaccountexpiry":0,"maxcollateral":"5000000000000000000000000000","maxdownloadbatchsize":20971520,"maxduration":12960,"maxephemeralaccountbalance":"0","maxrevisebatchsize":20971520,"netaddress":"127.0.0.1:49382","remainingstorage":41943040,"revisionnumber":0,"sectoraccessprice":"100","sectorsize":4194304,"siamuxport":"49383","storageprice":"23148148148","totalstorage":41943040,"unlockhash":"924062adae8ceacb95dd0b1e36c74375e170fcb1dc758cc980cc217e6310ba32bac79faf1539","uploadbandwidthprice":"100000000000000","version":"2.0.0","windowsize":5}},"success":true,"timestamp":"2023-03-31T15:58:41.650072+02:00","type":"scan"}] */
export type InteractionsCreatePayload = object;

export type InteractionsCreateData = string;

/** @example {"minRecentScanFailures":3,"maxDowntimeHours":"1000"} */
export type RemoveCreatePayload = object;

export type RemoveCreateData = object;

export interface ScanningListParams {
  /** @example "0" */
  offset?: number;
  /** @example "10" */
  limit?: number;
  /** @example "2023-03-30T15%3A45%3A52%2B02%3A00" */
  lastScan?: string;
}

export type ScanningListData = object;

/** @example {"contractSet":"autopilot","object":{"Key":"key:d3045c3c7c7d30d5824f87e94d66466d25846ca62867b73901e2f95aec353c1d","Slabs":[{"Key":"key:c89032a5f3bb5229cf54043c4c2c1c7ee4424cf507755242c1d018a5ab88f936","MinShards":2,"Shards":[{"Host":"ed25519:9743a98b215dc76ddfb1a1722257c339c062cbef1ce177720e43e5c00ff03834","Root":"h:c15220fc8751fdd4d868e3df3c018ef15ba235b0cac0d514d00877661506a895"},{"Host":"ed25519:66bc9ab2d386a4b152781efb5302fb09a52abb979dae5d1dbab036f45a4e08a5","Root":"h:7bd5a1ecb0beeb6d973c0909b4ab3d3624ce7f9a73b5a15da696b55979018f9f"},{"Host":"ed25519:b24553566b992d5e5fc0be645c55c7d3c925776f7b66a64910a5e66ac00bbec3","Root":"h:1ecd3ad15afaaef74f1e630807e68c2135ab2347400a2500d559ffec08635cf6"}],"Offset":0,"Length":349525}]},"usedContracts":{"ed25519:66bc9ab2d386a4b152781efb5302fb09a52abb979dae5d1dbab036f45a4e08a5":"fcid:e28a88d1c74a696f513a6292d19a9773425d960bc2e88c0ace7b372139b01b96","ed25519:9743a98b215dc76ddfb1a1722257c339c062cbef1ce177720e43e5c00ff03834":"fcid:f398e543c8071d1e1d71403f70ff755d9f8ce3ff1f20c0a4e9cea04ac3c51bd6","ed25519:b24553566b992d5e5fc0be645c55c7d3c925776f7b66a64910a5e66ac00bbec3":"fcid:ea77e9caf34f408e9cc3d842b22f744701c4ad6e4ccec6e816c3ebaa923d3784"}} */
export type KeyUpdatePayload = object;

export type KeyUpdateData = string;

export interface UploaderListParams {
  /** @example "-1" */
  prefix?: number;
}

export type UploaderListData = object;

export type ObjectsDeleteData = string;

/** @example ""{\n    \"from\": \"<string>\",\n    \"to\": \"<string>\",\n    \"mode\": \"<string>\"\n}"" */
export type RenameCreatePayload = string;

export type RenameCreateError = string;

export type DownloadListData = object;

export type GougingListData = object;

export type UploadListData = object;

/** @example {"offset":0,"limit":10,"filterMode":"all","addressContains":"sia","keyIn":[]} */
export type HostsCreateBody = object;

export type HostsCreateResult = object;

export interface ObjectsListParams {
  /** @example "1" */
  offset?: number;
  /** @example "1" */
  limit?: number;
  /** @example "Garfield" */
  key?: string;
}

export type ObjectsListData = object;

export type SettingsListData = object;

export type SettingDetailData = object;

/** @example {"hostBlockHeightLeeway":3,"maxContractPrice":"1000000000000000000000000","maxDownloadPrice":"2500000000000000000000000000","maxRPCPrice":"1000000000000000000","maxStoragePrice":"631593542897","maxUploadPrice":"2500000000000000000000000000","minAccountExpiry":86400000000000,"minMaxCollateral":"0","minMaxEphemeralAccountBalance":"1000000000000000000000000","minPriceTableValidity":300000000000} */
export type SettingUpdatePayload = object;

export type SettingUpdateData = any;

export type SettingDeleteData = string;

export type ObjectsListResult = object;

export type AddressListData = object;

/** @example "78.197.237.216:9981" */
export type ConnectCreatePayload = object;

export type ConnectCreateData = string;

export type PeersListData = object;

/** @example ""[{\n    \"siacoininputs\": [\n        {\n            \"parentid\": \"750d7ab31623702d359595c491b359ab05ec49217b660fb93b69b74518db46b1\",\n            \"unlockconditions\": {\n                \"timelock\": 0,\n                \"publickeys\": [\n                    {\n                        \"algorithm\": \"ed25519\",\n                        \"key\": \"zUkSvh+y+gfXVV5Rmn9Yo/tVoySaK3ukPZC7PuwUTRE=\"\n                    }\n                ],\n                \"signaturesrequired\": 1\n            }\n        }\n    ],\n    \"siacoinoutputs\": [\n        {\n            \"value\": \"110000000000000000000000000\",\n            \"unlockhash\": \"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08\"\n        },\n        {\n            \"value\": \"110000000000000000000000000\",\n            \"unlockhash\": \"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08\"\n        },\n        {\n            \"value\": \"11666013529973035363645398724\",\n            \"unlockhash\": \"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08\"\n        }\n    ],\n    \"filecontracts\": null,\n    \"filecontractrevisions\": null,\n    \"storageproofs\": null,\n    \"siafundinputs\": null,\n    \"siafundoutputs\": null,\n    \"minerfees\": [\n        \"10530000000000000000000\"\n    ],\n    \"arbitrarydata\": null,\n    \"transactionsignatures\": [\n        {\n            \"parentid\": \"750d7ab31623702d359595c491b359ab05ec49217b660fb93b69b74518db46b1\",\n            \"publickeyindex\": 0,\n            \"timelock\": 0,\n            \"coveredfields\": {\n                \"wholetransaction\": true,\n                \"siacoininputs\": null,\n                \"siacoinoutputs\": null,\n                \"filecontracts\": null,\n                \"filecontractrevisions\": null,\n                \"storageproofs\": null,\n                \"siafundinputs\": null,\n                \"siafundoutputs\": null,\n                \"minerfees\": null,\n                \"arbitrarydata\": null,\n                \"transactionsignatures\": null\n            },\n            \"signature\": \"ekCQ8v0NclbxRXH8IyQzE9xLYzI+xvuGSyTPZTXFIYxaWYj9BiPwbNtQaceJPIjtJwSI5HQHa++NRhN1DUn8Aw==\"\n        }\n    ]\n}]"" */
export type BroadcastCreatePayload = string;

export type BroadcastCreateData = string;

export type RecommendedfeeListData = object;

export type AddressListResult = object;

export type BalanceListData = object;

/** @example {"siacoininputs":[{"parentid":"b4f8d441a82fc11f32568f1c74725e9560907901c6a6715d2f1b15235a0a6316","unlockconditions":{"timelock":0,"publickeys":[{"algorithm":"ed25519","key":"zUkSvh+y+gfXVV5Rmn9Yo/tVoySaK3ukPZC7PuwUTRE="}],"signaturesrequired":1}}],"siacoinoutputs":[{"value":"14137927280229237597800256000","unlockhash":"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08"},{"value":"5000000000000000000000000","unlockhash":"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08"}],"filecontracts":null,"filecontractrevisions":null,"storageproofs":null,"siafundinputs":null,"siafundoutputs":null,"minerfees":["22500000000000000000000"],"arbitrarydata":null,"transactionsignatures":[{"parentid":"b4f8d441a82fc11f32568f1c74725e9560907901c6a6715d2f1b15235a0a6316","publickeyindex":0,"timelock":0,"coveredfields":{"wholetransaction":false,"siacoininputs":null,"siacoinoutputs":null,"filecontracts":null,"filecontractrevisions":null,"storageproofs":null,"siafundinputs":null,"siafundoutputs":null,"minerfees":[0],"arbitrarydata":null,"transactionsignatures":null},"signature":"3M2hWLHyrIoRg8wWJdq4kUgWV2vA/LjjGKlgLE7KAVydU19bIeW4PN37U6blhonl1pX/SehECR5ascE8yfjNDg=="}]} */
export type DiscardCreatePayload = object;

export type DiscardCreateData = any;

/** @example {"transaction":{"filecontracts":[{"filesize":0,"filemerkleroot":"0000000000000000000000000000000000000000000000000000000000000000","windowstart":399261,"windowend":399405,"payout":"141812049115488970349210000","validproofoutputs":[{"value":"135962858057138543001600000","unlockhash":"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08"},{"value":"318521142846357504000000","unlockhash":"e46bd90a234ecbd1783537763da3c3154dcde61aeccb0838fc2b32137e34e8b9d8095ed3f77f"}],"missedproofoutputs":[{"value":"135962858057138543001600000","unlockhash":"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08"},{"value":"318521142846357504000000","unlockhash":"e46bd90a234ecbd1783537763da3c3154dcde61aeccb0838fc2b32137e34e8b9d8095ed3f77f"},{"value":"0","unlockhash":"000000000000000000000000000000000000000000000000000000000000000089eb0d6a8a69"}],"unlockhash":"5b79c25cf6940705000a7c51b0271308cb02ebefdd80bfe5040914baa880cfc3d69770a87dd5","revisionnumber":0}]},"amount":"269772251232144184390000"} */
export type FundCreatePayload = object;

export type FundCreateData = any;

export type OutputsListData = object;

export type PendingListData = object;

/** @example {"endHeight":126,"hostCollateral":"191285052982572071957200","hostKey":"ed25519:8397a68cc151feee06f40560ae05010a3bc44e742435285ba09b20762c0bcbee","hostSettings":{"acceptingcontracts":true,"baserpcprice":"100","collateral":"46296296296","contractprice":"250000000000000000000000","downloadbandwidthprice":"100000000000000","ephemeralaccountexpiry":0,"maxcollateral":"5000000000000000000000000000","maxdownloadbatchsize":20971520,"maxduration":12960,"maxephemeralaccountbalance":"0","maxrevisebatchsize":20971520,"netaddress":"127.0.0.1:63843","remainingstorage":41943040,"revisionnumber":0,"sectoraccessprice":"100","sectorsize":4194304,"siamuxport":"63844","storageprice":"23148148148","totalstorage":41943040,"unlockhash":"e8e4c05379028b84391521d94b1a07035c073a707af987522898c644abccdc8d03a4e9d54253","uploadbandwidthprice":"100000000000000","version":"2.0.0","windowsize":5},"renterAddress":"addr:2c82211107b6b13c23161611f048eedef60488f0d1e46e46877dad21c1bb4b187d57af567852","renterFunds":"16666666666666666666666666","renterKey":"zsEWA5GFQFWYagfqO0W1F+lOYNBnZ/cPk4uf4Gv1xK8a+dY0u1ZfhouNBMPR0lW9rxTop6vDuf1LGU63kPL/bA=="} */
export type PrepareFormCreatePayload = object;

export type PrepareFormCreateError = object;

/** @example {"contract":{"ParentID":"fcid:49690e36d9955c6b4fe3d6b0612b77f26787305f61e68dfa50848a9d9a5e0075","UnlockConditions":{"Timelock":0,"PublicKeys":[{"Algorithm":"ed25519","Key":"GvnWNLtWX4aLjQTD0dJVva8U6Kerw7n9SxlOt5Dy/2w="},{"Algorithm":"ed25519","Key":"g5emjMFR/u4G9AVgrgUBCjvETnQkNShboJsgdiwLy+4="}],"SignaturesRequired":2},"Filesize":0,"FileMerkleRoot":"h:0000000000000000000000000000000000000000000000000000000000000000","WindowStart":126,"WindowEnd":131,"Payout":"340282366920938463463374607431768211455","ValidProofOutputs":[{"Value":"15666666461866666666666564","Address":"addr:2c82211107b6b13c23161611f048eedef60488f0d1e46e46877dad21c1bb4b187d57af567852"},{"Value":"1441285257782572071957302","Address":"addr:e8e4c05379028b84391521d94b1a07035c073a707af987522898c644abccdc8d03a4e9d54253"}],"MissedProofOutputs":[{"Value":"15666666461866666666666564","Address":"addr:2c82211107b6b13c23161611f048eedef60488f0d1e46e46877dad21c1bb4b187d57af567852"},{"Value":"1441285257782572071957302","Address":"addr:e8e4c05379028b84391521d94b1a07035c073a707af987522898c644abccdc8d03a4e9d54253"},{"Value":"0","Address":"addr:000000000000000000000000000000000000000000000000000000000000000089eb0d6a8a69"}],"UnlockHash":"h:fcc17c0ecb6ac3d41886ccd091db3234516a9faf9c7d2810e4aa14ebc1520340","RevisionNumber":4},"endHeight":176,"hostKey":"ed25519:8397a68cc151feee06f40560ae05010a3bc44e742435285ba09b20762c0bcbee","hostSettings":{"acceptingcontracts":true,"baserpcprice":"100","collateral":"46296296296","contractprice":"250000000000000000000000","downloadbandwidthprice":"100000000000000","ephemeralaccountexpiry":0,"maxcollateral":"5000000000000000000000000000","maxdownloadbatchsize":20971520,"maxduration":12960,"maxephemeralaccountbalance":"0","maxrevisebatchsize":20971520,"netaddress":"127.0.0.1:63843","remainingstorage":41943040,"revisionnumber":0,"sectoraccessprice":"100","sectorsize":4194304,"siamuxport":"63844","storageprice":"23148148148","totalstorage":41943040,"unlockhash":"e8e4c05379028b84391521d94b1a07035c073a707af987522898c644abccdc8d03a4e9d54253","uploadbandwidthprice":"100000000000000","version":"2.0.0","windowsize":5},"newCollateral":"283069390249021689235728","renterAddress":"addr:2c82211107b6b13c23161611f048eedef60488f0d1e46e46877dad21c1bb4b187d57af567852","renterFunds":"16666666666666666666666666","renterKey":"zsEWA5GFQFWYagfqO0W1F+lOYNBnZ/cPk4uf4Gv1xK8a+dY0u1ZfhouNBMPR0lW9rxTop6vDuf1LGU63kPL/bA=="} */
export type PrepareRenewCreatePayload = object;

export type PrepareRenewCreateData = object;

/** @example {"amount":"1000000","outputs":10} */
export type RedistributeCreatePayload = object;

export type RedistributeCreateData = object;

/** @example {"transaction":{"siacoininputs":[{"parentid":"490228c343560c8136a72fa6bc58568a9e1532c4e33af0a2589bf97fae264e8a","unlockconditions":{"timelock":0,"publickeys":[{"algorithm":"ed25519","key":"zUkSvh+y+gfXVV5Rmn9Yo/tVoySaK3ukPZC7PuwUTRE="}],"signaturesrequired":1}}],"siacoinoutputs":[{"value":"60000000000000000000000000","unlockhash":"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08"},{"value":"60000000000000000000000000","unlockhash":"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08"},{"value":"14515683222618202165130217990","unlockhash":"cb9f646a8ba80aa8a8c931c739f3a0d61d22c13b70f4536cafaae2722f81ca95727009664a08"}],"filecontracts":null,"filecontractrevisions":null,"storageproofs":null,"siafundinputs":null,"siafundoutputs":null,"minerfees":["10530000000000000000000"],"arbitrarydata":null,"transactionsignatures":null},"toSign":["490228c343560c8136a72fa6bc58568a9e1532c4e33af0a2589bf97fae264e8a"],"coveredFields":{"wholetransaction":false,"siacoininputs":[0],"siacoinoutputs":[0,1,2],"filecontracts":null,"filecontractrevisions":null,"storageproofs":null,"siafundinputs":null,"siafundoutputs":null,"minerfees":[0],"arbitrarydata":null,"transactionsignatures":null}} */
export type SignCreatePayload = object;

export type SignCreateData = any;

export type TransactionsListData = object;

export type ConfigListData = object;

/** @example {"wallet":{"defragThreshold":1000},"hosts":{"ignoreRedundantIPs":false,"maxDowntimeHours":0,"scoreOverrides":{}},"contracts":{"set":"autopilot","amount":100,"allowance":"10000000000000000000000000000","period":6048,"renewWindow":2016,"download":1099511627776,"upload":1099511627776,"storage":1099511627776}} */
export type ConfigUpdatePayload = object;

export type ConfigUpdateData = string;

/** @example {} */
export type TriggerCreatePayload = object;

export type TriggerCreateData = object;

export type StatusListData = object;

export type AccountDetailData = object;

export type GetIdData = object;

export type ObjectsUpdateError = string;

export type ObjectsDetailData = any;

export type ObjectsDelete2Data = string;

export type UploadsListData = any;

export interface ContractsListParams1 {
  /** @example "10" */
  hosttimeout?: number;
}

export type ContractsListResult = object;

/** @example {"endHeight":126,"hostCollateral":"191285052982572071957200","hostKey":"ed25519:878d7d27e75691aa8f554ecb4c3e0c371a2a2a3d0901fe77727b6df6c6a11a6a","hostIP":"127.0.0.1:59868","renterFunds":"16666666666666666666666666","renterAddress":"addr:861c1574947689c04df41a987b3a6a0a44eef27bb4511f3d64d1531913ca26288a12efc3f227"} */
export type FormCreatePayload = object;

export type FormCreateData = object;

/** @example {"contractID":"fcid:ce6639d456195048b2fbd0796a9b99b34ab7809ffed04de10cf8cfd631b574cb","hostKey":"ed25519:2f58b62c3f11d89148b352d8824f72013fac64beb7d1c853d46a4e68116f8fb8","siamuxAddr":"127.0.0.1:59999","balance":"1000000000000000000000000"} */
export type FundCreateBody = object;

export type FundCreateResult = string;

/** @example {"contractID":"fcid:4a1a94c868940c19753098c8e409fc370c1df720fa37187b506a8ff7785eae8e","endHeight":176,"hostKey":"ed25519:878d7d27e75691aa8f554ecb4c3e0c371a2a2a3d0901fe77727b6df6c6a11a6a","hostIP":"127.0.0.1:59868","newCollateral":"283069390249021689235728","renterAddress":"addr:861c1574947689c04df41a987b3a6a0a44eef27bb4511f3d64d1531913ca26288a12efc3f227","renterFunds":"16666666666666666666666666"} */
export type RenewCreatePayload = object;

export type RenewCreateError = object;

/** @example {"hostIP":"[blacklace.ddns.net]:9982","hostKey":"ed25519:378f4722515e01862c1396a6545c9c52dbaf12b2069d3b81ea5e405ef4220526"} */
export type ScanCreatePayload = object;

export type ScanCreateData = object;

/** @example {"contractID":"fcid:ce6639d456195048b2fbd0796a9b99b34ab7809ffed04de10cf8cfd631b574cb","hostKey":"ed25519:2f58b62c3f11d89148b352d8824f72013fac64beb7d1c853d46a4e68116f8fb8","siamuxAddr":"127.0.0.1:59999"} */
export type SyncCreatePayload = object;

export type SyncCreateData = string;

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "http://{{bus_uri}}{{bus_api_prefix}}";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title renterd
 * @version 1.0.0
 * @baseUrl http://{{bus_uri}}{{bus_api_prefix}}
 *
 * The `renterd` API is composed of three components. Which can either run within a single process or be set up as a cluster of microservices.
 *
 * 1. Bus
 * 2. Worker(s)
 * 3. Autopilot
 *
 *
 * The **bus** is the heart of `renterd`. It handles most of the persistence of the stack and also interacts with the underlying peer-to-peer network of the Sia network.
 *
 * The **worker** is the component that users interact with most of the time. It talks directly to hosts for uploading, downloading, forming contracts and renewing contracts. All the data it needs to do so is persisted in the \*bus\*. When set up as a cluster, multiple workers can communicate with the same bus. That way horizontal scalability can achieved.
 *
 * The **autopilot** is an optional component that helps with running `renterd` by automatically forming contracts, renewing them, scanning hosts as well as keeping ephemeral accounts funded. Users are free to disable it and manually interact with workers or write their own automation instead.
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  service = {
    canCreateUser: (data: LoginData, params: RequestParams = {}) =>
        this.request<LoginData, {result: boolean}>({
          path: `/users/validate`,
          method: "POST",
          body: data,
          // type: ContentType.Json,
          ...params,
    }),
    login: (data: LoginData, params: RequestParams = {}) =>
        this.request<LoginData, {wallet: string, token: string}>({
          path: `/users/login`,
          method: "POST",
          body: data,
          // type: ContentType.Json,
          ...params,
        }),
    register: (data: LoginData, params: RequestParams = {}) =>
        this.request<LoginData, {wallet: string, token: string}>({
          path: `/users`,
          method: "POST",
          body: data,
          // type: ContentType.Json,
          ...params,
        }),
    settings: (wallet: string, params: RequestParams = {}) =>
          this.request<any, any>({
              path: `/settings/${wallet}/subscription`,
              method: "GET",
              secure: true,
              ...params,
          }),
    last_version: (params: RequestParams = {}) =>
          this.request<any, any>({
              path: `/settings/version`,
              method: "GET",
              secure: true,
              ...params,
          }),

    subscribe: (data: SubscriptionData, params: RequestParams = {}) =>
          this.request<SubscriptionData, {user: {wallet: string} }>({
              path: `/users/subscribe`,
              method: "POST",
              body: data,
              // type: ContentType.Json,
              ...params,
          }),
    finalizeSubscribe: (data: SubscriptionData, params: RequestParams = {}) =>
          this.request<SubscriptionData, {user: {wallet: string} }>({
              path: `/users/finalize_subscribe`,
              method: "POST",
              body: data,
              // type: ContentType.Json,
              ...params,
          }),
    cancelSubscribe: (data: SubscriptionData, params: RequestParams = {}) =>
          this.request<SubscriptionData, {user: {wallet: string} }>({
              path: `/users/cancel_subscribe`,
              method: "POST",
              body: data,
              // type: ContentType.Json,
              ...params,
          }),
    subscriptionList: (data: SubscriptionReqData, params: RequestParams = {}) =>
      this.request<SubscriptionReqData, {subscriptions: [{status: boolean, plan_code: string}] }>({
          path: `/users/subscriptions`,
          method: "POST",
          body: data,
          // type: ContentType.Json,
          ...params,
      }),
    usage: (data: SubscriptionReqData, params: RequestParams = {}) =>
      this.request<SubscriptionReqData, {customer_usage: {charges_usage: [{units: string}]} }>({
          path: `/users/usage`,
          method: "POST",
          body: data,
          // type: ContentType.Json,
          ...params,
      }),
    subscriptionUsageEvent: (data: SubscriptionUsageEventData, params: RequestParams = {}) =>
      this.request<SubscriptionUsageEventData, any>({
          path: `users/subscription-usage-event`,
          method: "POST",
          body: data,
          // type: ContentType.Json,
          ...params,
      }),
    sendFeedback: (data: FeedbackData, params: RequestParams = {}) =>
      this.request<FeedbackData, {status: boolean, user: {wallet: string} }>({
          path: `/mail/feedback`,
          method: "POST",
          body: data,
          // type: ContentType.Json,
          ...params,
      })
  }
  accounts = {
    /**
     * @description Returns all known ephemeral accounts from the bus.
     *
     * @tags bus
     * @name AccountsList
     * @summary /accounts
     * @request GET:/accounts
     * @secure
     */
    accountsList: (params: RequestParams = {}) =>
      this.request<AccountsListData, any>({
        path: `/accounts`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the account with the given ID. If it doesn't exist, it will be created. The provided host's key will be attached to the account as additional metadata.
     *
     * @tags bus
     * @name AccountsCreate
     * @summary /accounts/:id
     * @request POST:/accounts/{id}
     * @secure
     */
    accountsCreate: (id: string, data: AccountsCreatePayload, params: RequestParams = {}) =>
      this.request<AccountsCreateData, any>({
        path: `/accounts/${id}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Commonly used by the worker, this endpoint allows for locking an account either exclusively or not. Usually workers will deposit and withdraw from accounts with a regular lock but for syncing the account balance with hosts an exclusive lock is required. The duration specifies the time after which the account is unlocked automatically. The returned lock id can be used to unlock the account again sooner.
     *
     * @tags bus
     * @name LockCreate
     * @summary /accounts/:id/lock
     * @request POST:/accounts/{id}/lock
     * @secure
     */
    lockCreate: (id: string, data: LockCreatePayload, params: RequestParams = {}) =>
      this.request<LockCreateData, any>({
        path: `/accounts/${id}/lock`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description This is the counterpart to the account locking endpoint. The lock id returned when locking an account can be used to unlock it again before the locking duration has passed and the account gets unlocked automatically.
     *
     * @tags bus
     * @name UnlockCreate
     * @summary /accounts/:id/unlock
     * @request POST:/accounts/{id}/unlock
     * @secure
     */
    unlockCreate: (id: string, data: UnlockCreatePayload, params: RequestParams = {}) =>
      this.request<UnlockCreateData, any>({
        path: `/accounts/${id}/unlock`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Endpoint used for depositing or withdrawing tokens into/from an ephemeral account. The caller should hold a non-exlusive lock on the account.
     *
     * @tags bus
     * @name PostAccounts
     * @summary /accounts/:id/add
     * @request POST:/accounts/{id}/add
     * @secure
     */
    postAccounts: (id: string, data: PostAccountsPayload, params: RequestParams = {}) =>
      this.request<PostAccountsData, any>({
        path: `/accounts/${id}/add`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Updates the balance of an account to the provided value. The caller should acquire an exclusive lock before calling this endpoint.
     *
     * @tags bus
     * @name UpdateCreate
     * @summary /accounts/:id/update
     * @request POST:/accounts/{id}/update
     * @secure
     */
    updateCreate: (id: string, data: UpdateCreatePayload, params: RequestParams = {}) =>
      this.request<UpdateCreateData, any>({
        path: `/accounts/${id}/update`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description This endpoint marks the accoutn as requiring a balance sync. Usually set by workers when operations fail with an error indicating an insufficient balance. The autopilot (if enabled) will periodically check for accounts that require syncing and initialise the sync automatically.
     *
     * @tags bus
     * @name RequressyncCreate
     * @summary /accounts/:id/requiressync
     * @request POST:/accounts/{id}/requressync
     * @secure
     */
    requressyncCreate: (id: string, data: RequressyncCreatePayload, params: RequestParams = {}) =>
      this.request<RequressyncCreateData, any>({
        path: `/accounts/${id}/requressync`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Resets the drift on ephemeral accounts. The drift tracks by how much Siacoin the expected balance of `renterd` differs from the host's over time. If the drift is too large, the autopilot refuses to pour more money into a host's account. Resetting the drift will cause the autopilot to fund the account again.
     *
     * @tags bus
     * @name ResetdriftCreate
     * @summary /accounts/:id/resetdrift
     * @request POST:/accounts/{id}/resetdrift
     * @secure
     */
    resetdriftCreate: (id: string, data: any, params: RequestParams = {}) =>
      this.request<ResetdriftCreateData, any>({
        path: `/accounts/${id}/resetdrift`,
        method: "POST",
        body: data,
        secure: true,
        ...params,
      }),
  };
  contracts = {
    /**
     * @description Returns all active contracts the bus is aware of. This includes all contracts that have not expired, have not been renewed and also not manually archived yet. Contracts are also active if they are not part of a contract set.
     *
     * @tags bus
     * @name ContractsList
     * @summary /contracts
     * @request GET:/contracts
     * @secure
     */
    contractsList: (params: RequestParams = {}) =>
      this.request<ContractsListData, any>({
        path: `/contracts`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Deletes all contracts from the bus. The contracts are not removed from the blockchain.
     *
     * @tags bus
     * @name DeleteContracts
     * @summary /contracts/all
     * @request DELETE:/contracts/all
     * @secure
     */
    deleteContracts: (params: RequestParams = {}) =>
      this.request<DeleteContractsData, any>({
        path: `/contracts/all`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the names of all contract sets known to the bus.
     *
     * @tags bus
     * @name SetsList
     * @summary /contracts/sets
     * @request GET:/contracts/sets
     * @secure
     */
    setsList: (params: RequestParams = {}) =>
      this.request<SetsListData, any>({
        path: `/contracts/sets`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns metadata of all contracts in the contract set with the provided name.
     *
     * @tags bus
     * @name GetContracts
     * @summary /contracts/set/:set
     * @request GET:/contracts/set/{set}
     * @secure
     */
    getContracts: (set: string, params: RequestParams = {}) =>
      this.request<GetContractsData, any>({
        path: `/contracts/set/${set}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Creates a new named contractset from a list of contract ids.
     *
     * @tags bus
     * @name PutContracts
     * @summary /contracts/set/:set
     * @request PUT:/contracts/set/{set}
     * @secure
     */
    putContracts: (set: string, data: PutContractsPayload, params: RequestParams = {}) =>
      this.request<PutContractsData, any>({
        path: `/contracts/set/${set}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Deletes the contract set with the given name.
     *
     * @tags bus
     * @name DeleteContracts2
     * @summary /contracts/set/:set
     * @request DELETE:/contracts/set/{set}
     * @originalName deleteContracts
     * @duplicate
     * @secure
     */
    deleteContracts2: (set: string, params: RequestParams = {}) =>
      this.request<DeleteContracts2Data, any>({
        path: `/contracts/set/${set}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Updates the spending of the contract with the given id by adding the provided values to the existing spending of the contract.
     *
     * @tags bus
     * @name SpendingCreate
     * @summary /contracts/spending
     * @request POST:/contracts/spending
     * @secure
     */
    spendingCreate: (data: SpendingCreatePayload, params: RequestParams = {}) =>
      this.request<SpendingCreateData, any>({
        path: `/contracts/spending`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  alerts = {
    /**
     * @description Returns all active contracts the bus is aware of. This includes all contracts that have not expired, have not been renewed and also not manually archived yet. Contracts are also active if they are not part of a contract set.
     *
     * @tags bus
     * @name AlertsList
     * @summary /alerts
     * @request GET:/alerts
     * @secure
     */
    alertsList: (params: RequestParams = {}) =>
      this.request<AlertsListData, any>({
        path: `/alerts`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  contract = {
    /**
     * @description Adds a contract to the bus. Usually called by workers after forming a new contract.
     *
     * @tags bus
     * @name ContractCreate
     * @summary /contract/:id
     * @request POST:/contract/{id}
     * @secure
     */
    contractCreate: (id: string, data: ContractCreatePayload, params: RequestParams = {}) =>
      this.request<ContractCreateData, any>({
        path: `/contract/${id}`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns contract metadata for an active contract with the provided contract id.
     *
     * @tags bus
     * @name ContractDetail
     * @summary /contract/:id
     * @request GET:/contract/{id}
     * @secure
     */
    contractDetail: (id: string, params: RequestParams = {}) =>
      this.request<ContractDetailData, any>({
        path: `/contract/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Deletes a contract from the bus. This doesn't remove the contract from the blockchain. The bus only stops being aware of the contract's existence and will therefore stop using it.
     *
     * @tags bus
     * @name ContractDelete
     * @summary /contract/:id
     * @request DELETE:/contract/{id}
     * @secure
     */
    contractDelete: (id: string, params: RequestParams = {}) =>
      this.request<ContractDeleteData, any>({
        path: `/contract/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Acquires a contract for up to a given duration. Similar to ephemeral accounts, contracts can be unlocked ahead of time using the unlock endpoint with the returned lock id. Contracts are implicitly acquired by the workers whenever they need to revise them.
     *
     * @tags bus
     * @name AcquireCreate
     * @summary /contract/:id/acquire
     * @request POST:/contract/{id}/acquire
     * @secure
     */
    acquireCreate: (id: string, data: AcquireCreatePayload, params: RequestParams = {}) =>
      this.request<AcquireCreateData, any>({
        path: `/contract/${id}/acquire`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Releases a previously acquired contract using the obtained lock id.
     *
     * @tags bus
     * @name ReleaseCreate
     * @summary /contract/:id/release
     * @request POST:/contract/{id}/release
     * @secure
     */
    releaseCreate: (id: string, data: ReleaseCreatePayload, params: RequestParams = {}) =>
      this.request<ReleaseCreateData, any>({
        path: `/contract/${id}/release`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns a chain of ancestors for a given contract. Ancestors are archived contracts which form a chain of renewals up to the requested contract.
     *
     * @tags bus
     * @name AncestorsDetail
     * @summary /contract/:id/ancestors
     * @request GET:/contract/{id}/ancestors
     * @secure
     */
    ancestorsDetail: (id: string, params: RequestParams = {}) =>
      this.request<AncestorsDetailData, any>({
        path: `/contract/${id}/ancestors`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Similar to the `/contract/:id POST` endpoint, this endpoint adds a new contract to the bus but it also archives the contract that the new contract has been renewed from.
     *
     * @tags bus
     * @name RenewedCreate
     * @summary /contract/:id/renewed
     * @request POST:/contract/{id}/renewed
     * @secure
     */
    renewedCreate: (id: string, data: RenewedCreatePayload, params: RequestParams = {}) =>
      this.request<RenewedCreateData, any>({
        path: `/contract/${id}/renewed`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  consensus = {
    /**
     * @description Accepts a mined block. Upon success, the block is forwarded to the node's peers and the whole p2p network.
     *
     * @tags bus
     * @name AcceptblockCreate
     * @summary /consensus/acceptblock
     * @request POST:/consensus/acceptblock
     * @secure
     */
    acceptblockCreate: (data: AcceptblockCreatePayload, params: RequestParams = {}) =>
      this.request<AcceptblockCreateData, any>({
        path: `/consensus/acceptblock`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns some info regarding the current state of the consensus.
     *
     * @tags bus
     * @name StateList
     * @summary /consensus/state
     * @request GET:/consensus/state
     * @secure
     */
    stateList: (params: RequestParams = {}) =>
      this.request<StateListData, any>({
        path: `/consensus/state`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Given the total payout of a contract, this endpoint returns the appropriate siafund fee to pay.
     *
     * @tags bus
     * @name SiafundfeeDetail
     * @summary /consensus/siafundfee/payout
     * @request GET:/consensus/siafundfee/{payout}
     * @secure
     */
    siafundfeeDetail: (payout: number, params: RequestParams = {}) =>
      this.request<SiafundfeeDetailData, any>({
        path: `/consensus/siafundfee/${payout}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  host = {
    /**
     * @description Same as the `/host/:pubkey` endpoint on the bus but with some added, autopilot specific information. e.g. the host's score as perceived by the autopilot.
     *
     * @tags autopilot
     * @name HostDetail
     * @summary /host/:pubkey
     * @request GET:/host/{pubkey}
     * @secure
     */
    hostDetail: (pubkey: string, params: RequestParams = {}) =>
      this.request<HostDetailData, any>({
        path: `/host/${pubkey}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  hosts = {
    /**
     * @description Returns information about all hosts known to the bus.
     *
     * @tags bus
     * @name HostsList
     * @summary /hosts
     * @request GET:/hosts
     * @secure
     */
    hostsList: (params: RequestParams = {}) =>
      this.request<HostsListData, any>({
        path: `/hosts`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Same as `/host/:pubkey` but returns multiple hosts.
     *
     * @tags autopilot
     * @name HostsCreate
     * @summary /hosts
     * @request POST:/hosts
     * @secure
     */
    hostsCreate: (data: HostsCreatePayload, params: RequestParams = {}) =>
      this.request<HostsCreateData, any>({
        path: `/hosts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Updates the allowlist of the bus by adding/removing hosts by their public key.
     *
     * @tags bus
     * @name AllowlistUpdate
     * @summary /hosts/allowlist
     * @request PUT:/hosts/allowlist
     * @secure
     */
    allowlistUpdate: (data: AllowlistUpdatePayload, params: RequestParams = {}) =>
      this.request<AllowlistUpdateData, any>({
        path: `/hosts/allowlist`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns the current allowlist of the bus.
     *
     * @tags bus
     * @name AllowlistList
     * @summary /hosts/allowlist
     * @request GET:/hosts/allowlist
     * @secure
     */
    allowlistList: (params: RequestParams = {}) =>
      this.request<AllowlistListData, any>({
        path: `/hosts/allowlist`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Updates the blocklist of the bus by adding/removing hosts by their domain or IP address.
     *
     * @tags bus
     * @name BlocklistUpdate
     * @summary /hosts/blocklist
     * @request PUT:/hosts/blocklist
     * @secure
     */
    blocklistUpdate: (data: BlocklistUpdatePayload, params: RequestParams = {}) =>
      this.request<BlocklistUpdateData, any>({
        path: `/hosts/blocklist`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns the current blocklist of the bus
     *
     * @tags bus
     * @name BlocklistList
     * @summary /hosts/blocklist
     * @request GET:/hosts/blocklist
     * @secure
     */
    blocklistList: (params: RequestParams = {}) =>
      this.request<BlocklistListData, any>({
        path: `/hosts/blocklist`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Records host ineractions in the bus. Commonly called by workers when scanning hosts.
     *
     * @tags bus
     * @name InteractionsCreate
     * @summary /hosts/interactions
     * @request POST:/hosts/interactions
     * @secure
     */
    interactionsCreate: (data: InteractionsCreatePayload, params: RequestParams = {}) =>
      this.request<InteractionsCreateData, any>({
        path: `/hosts/interactions`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Removes all hosts with a given downtime and minimum number of total scans from the bus.
     *
     * @tags bus
     * @name RemoveCreate
     * @summary /hosts/remove
     * @request POST:/hosts/remove
     * @secure
     */
    removeCreate: (data: RemoveCreatePayload, params: RequestParams = {}) =>
      this.request<RemoveCreateData, any>({
        path: `/hosts/remove`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns a list of hosts for scanning. Hosts that have been scanned recently can be ignored by adjusting the lastScan argument.
     *
     * @tags bus
     * @name ScanningList
     * @summary /hosts/scanning
     * @request GET:/hosts/scanning
     * @secure
     */
    scanningList: (query: ScanningListParams, params: RequestParams = {}) =>
      this.request<ScanningListData, any>({
        path: `/hosts/scanning`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
  objects = {
    /**
     * @description Stores metadata for an object in the bus, overwriting existing metadata in the process. Usually called by the worker after uploading an object to the network.
     *
     * @tags bus
     * @name KeyUpdate
     * @summary /objects/*key
     * @request PUT:/objects/*key
     * @secure
     */
    keyUpdate: (data: KeyUpdatePayload, params: RequestParams = {}) =>
      this.request<KeyUpdateData, any>({
        path: `/objects/*key`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns either the metadata for an object if the key matches an object or, if the key ends with a '/', returns a list of objects within the dir.
     *
     * @tags bus
     * @name UploaderList
     * @summary /objects/*key
     * @request GET:/objects/uploader/
     * @secure
     */
    uploaderList: (query: UploaderListParams, params: RequestParams = {}) =>
      this.request<UploaderListData, any>({
        path: `/objects/uploader/`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Delete the object with the given key. If `batch` is true all keys starting with `path` will be removed.
     *
     * @tags bus
     * @name ObjectsDelete
     * @summary /objects/*key
     * @request DELETE:/objects/
     * @secure
     */
    objectsDelete: (params: RequestParams = {}) =>
      this.request<ObjectsDeleteData, any>({
        path: `/objects/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Renames a single object or recursively renames multiple objects.
     *
     * @tags bus
     * @name RenameCreate
     * @summary /objects/rename
     * @request POST:/objects/rename
     * @secure
     */
    renameCreate: (data: RenameCreatePayload, params: RequestParams = {}) =>
      this.request<any, RenameCreateError>({
        path: `/objects/rename`,
        method: "POST",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Uploads a new object to the given path. A path can be multiple layers deep such as `foo/bar/baz`.
     *
     * @tags worker
     * @name ObjectsUpdate
     * @summary /objects/*key
     * @request PUT:/objects/{path}
     * @secure
     */
    objectsUpdate: (path: string, data: any, params: RequestParams = {}) =>
      this.request<any, ObjectsUpdateError>({
        path: `/objects/${path}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Text,
        ...params,
      }),

    /**
     * @description Downloads the object at the given path.
     *
     * @tags worker
     * @name ObjectsDetail
     * @summary /objects/*key
     * @request GET:/objects/{path}
     * @secure
     */
    objectsDetail: (path: string, params: RequestParams = {}) =>
      this.request<ObjectsDetailData, any>({
        path: `/objects/${path}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Deletes the object at the given path.
     *
     * @tags worker
     * @name ObjectsDelete2
     * @summary /objects/*key
     * @request DELETE:/objects/{path}
     * @originalName objectsDelete
     * @duplicate
     * @secure
     */
    objectsDelete2: (path: string, params: RequestParams = {}) =>
      this.request<ObjectsDelete2Data, any>({
        path: `/objects/${path}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  params = {
    /**
     * @description Returns the default download parameters used by workers.
     *
     * @tags bus
     * @name DownloadList
     * @summary /params/download
     * @request GET:/params/download
     * @secure
     */
    downloadList: (params: RequestParams = {}) =>
      this.request<DownloadListData, any>({
        path: `/params/download`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the default gouging params used by workers.
     *
     * @tags bus
     * @name GougingList
     * @summary /params/gouging
     * @request GET:/params/gouging
     * @secure
     */
    gougingList: (params: RequestParams = {}) =>
      this.request<GougingListData, any>({
        path: `/params/gouging`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the default upload params used by workers.
     *
     * @tags bus
     * @name UploadList
     * @summary /params/upload
     * @request GET:/params/upload
     * @secure
     */
    uploadList: (params: RequestParams = {}) =>
      this.request<UploadListData, any>({
        path: `/params/upload`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  search = {
    /**
     * @description Returns all hosts matching a set of criteria. Possible values for the filter mode are: - "all" - return any host - "allowed" - only return allowed hosts - "blocked" - only return blocked hosts
     *
     * @tags bus
     * @name HostsCreate
     * @summary /search/hosts
     * @request POST:/search/hosts
     * @secure
     */
    hostsCreate: (data: HostsCreateBody, params: RequestParams = {}) =>
      this.request<HostsCreateResult, any>({
        path: `/search/hosts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns a list of objects that have a given key in their name.
     *
     * @tags bus
     * @name ObjectsList
     * @summary /search/objects
     * @request GET:/search/objects
     * @secure
     */
    objectsList: (query: ObjectsListParams, params: RequestParams = {}) =>
      this.request<ObjectsListData, any>({
        path: `/search/objects`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),
  };
  settings = {
    /**
     * @description Returns a list of keys for all available settings in the bus.
     *
     * @tags bus
     * @name SettingsList
     * @summary /settings
     * @request GET:/settings
     * @secure
     */
    settingsList: (params: RequestParams = {}) =>
      this.request<SettingsListData, any>({
        path: `/settings`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  setting = {
    /**
     * @description Returns the current settings for a specific key.
     *
     * @tags bus
     * @name SettingDetail
     * @summary /setting/:key
     * @request GET:/setting/{key}
     * @secure
     */
    settingDetail: (key: string, params: RequestParams = {}) =>
      this.request<SettingDetailData, any>({
        path: `/setting/${key}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Updates the settings for a given key.
     *
     * @tags bus
     * @name SettingUpdate
     * @summary /setting/:key
     * @request PUT:/setting/{key}
     * @secure
     */
    settingUpdate: (key: string, data: SettingUpdatePayload, params: RequestParams = {}) =>
      this.request<SettingUpdateData, any>({
        path: `/setting/${key}`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Deletes the settings for a given key.
     *
     * @tags bus
     * @name SettingDelete
     * @summary /setting/:key
     * @request DELETE:/setting/{key}
     * @secure
     */
    settingDelete: (key: string, params: RequestParams = {}) =>
      this.request<SettingDeleteData, any>({
        path: `/setting/${key}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),
  };
  stats = {
    /**
     * @description Returns information about the objects currently tracked by the bus such as: - `numObjects` - total number of objects - `totalObjectsSize` - actual size of objects before upload to the network - `totalSectorsSize` - ideal size of objects on the network after adding padding and redundancy - `totalUploadedSize` - actual size of objects on the network which can diverge from `totalSectorsSize` in case parts of the object were migrated since the original hosts holding the data went bad or missing
     *
     * @tags bus
     * @name ObjectsList
     * @summary /stats/objects
     * @request GET:/stats/objects
     * @secure
     */
    objectsList: (params: RequestParams = {}) =>
      this.request<ObjectsListResult, any>({
        path: `/stats/objects`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Downloads the object at the given path.
     *
     * @tags worker
     * @name UploadsList
     * @summary /stats/downloads
     * @request GET:/stats/uploads
     * @secure
     */
    uploadsList: (params: RequestParams = {}) =>
      this.request<UploadsListData, any>({
        path: `/stats/uploads`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  syncer = {
    /**
     * @description Returns the address the bus is listening on for incoming p2p connections.
     *
     * @tags bus
     * @name AddressList
     * @summary /syncer/address
     * @request GET:/syncer/address
     * @secure
     */
    addressList: (params: RequestParams = {}) =>
      this.request<AddressListData, any>({
        path: `/syncer/address`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags bus
     * @name ConnectCreate
     * @summary /syncer/connect
     * @request POST:/syncer/connect
     * @secure
     */
    connectCreate: (data: ConnectCreatePayload, params: RequestParams = {}) =>
      this.request<ConnectCreateData, any>({
        path: `/syncer/connect`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns the peers of the p2p network that the bus is currently connected to.
     *
     * @tags bus
     * @name PeersList
     * @summary /syncer/peers
     * @request GET:/syncer/peers
     * @secure
     */
    peersList: (params: RequestParams = {}) =>
      this.request<PeersListData, any>({
        path: `/syncer/peers`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  txpool = {
    /**
     * @description Broadcasts a transaction to the p2p network in case it's valid according to the bus. If it contains enough miner fees it will eventually be mined into a block.
     *
     * @tags bus
     * @name BroadcastCreate
     * @summary /txpool/broadcast
     * @request POST:/txpool/broadcast
     * @secure
     */
    broadcastCreate: (data: BroadcastCreatePayload, params: RequestParams = {}) =>
      this.request<BroadcastCreateData, any>({
        path: `/txpool/broadcast`,
        method: "POST",
        body: data,
        secure: true,
        ...params,
      }),

    /**
     * @description Returns all unconfirmed transaction that are currently in the transaction pool.
     *
     * @tags bus
     * @name RecommendedfeeList
     * @summary /txpool/transactions
     * @request GET:/txpool/recommendedfee
     * @secure
     */
    recommendedfeeList: (params: RequestParams = {}) =>
      this.request<RecommendedfeeListData, any>({
        path: `/txpool/recommendedfee`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  wallet = {
    /**
     * @description Returns an address that can be used to fund the wallet.
     *
     * @tags bus
     * @name AddressList
     * @summary /wallet/address
     * @request GET:/wallet/address
     * @secure
     */
    addressList: (params: RequestParams = {}) =>
      this.request<AddressListResult, any>({
        path: `/wallet/address`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Returns the current balance of the wallet according to its unspent transaction outputs.
     *
     * @tags bus
     * @name BalanceList
     * @summary /wallet/balance
     * @request GET:/wallet/balance
     * @secure
     */
    balanceList: (params: RequestParams = {}) =>
      this.request<BalanceListData, any>({
        path: `/wallet/balance`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Discards a transaction. That means the wallet will know that it is safe to reuse all of the inputs of the transaction for future transactions.
     *
     * @tags bus
     * @name DiscardCreate
     * @summary /wallet/discard
     * @request POST:/wallet/discard
     * @secure
     */
    discardCreate: (data: DiscardCreatePayload, params: RequestParams = {}) =>
      this.request<DiscardCreateData, any>({
        path: `/wallet/discard`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Funds the provided transaction with a given amount of funds. Returns the funded transactions, the list of inputs to the transaction that require signing as well as any unconfirmed parents required for the transaction to appear as valid. If the transaction is not broadcasted, it needs to be discarded using the `/wallet/discard` endpoint.
     *
     * @tags bus
     * @name FundCreate
     * @summary /wallet/fund
     * @request POST:/wallet/fund
     * @secure
     */
    fundCreate: (data: FundCreatePayload, params: RequestParams = {}) =>
      this.request<FundCreateData, any>({
        path: `/wallet/fund`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns all confirmed UTXOs relevant to the wallet
     *
     * @tags bus
     * @name OutputsList
     * @summary /wallet/outputs
     * @request GET:/wallet/outputs
     * @secure
     */
    outputsList: (params: RequestParams = {}) =>
      this.request<OutputsListData, any>({
        path: `/wallet/outputs`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Similar to `/txpool/transactions` but returns only unconfirmed transactions that belong to the wallet. That means either outgoing or incoming transactions.
     *
     * @tags bus
     * @name PendingList
     * @summary /wallet/pending
     * @request GET:/wallet/pending
     * @secure
     */
    pendingList: (params: RequestParams = {}) =>
      this.request<PendingListData, any>({
        path: `/wallet/pending`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Prepares a new, unsigned contract with a host. Usually called by the worker when forming a new contract with a host.
     *
     * @tags bus
     * @name PrepareFormCreate
     * @summary /wallet/prepare/form
     * @request POST:/wallet/prepare/form
     * @secure
     */
    prepareFormCreate: (data: PrepareFormCreatePayload, params: RequestParams = {}) =>
      this.request<any, PrepareFormCreateError>({
        path: `/wallet/prepare/form`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Prepares a new, unsigned contract with a host. Usually called by the worker when renewing a new contract with a host.
     *
     * @tags bus
     * @name PrepareRenewCreate
     * @summary /wallet/prepare/renew
     * @request POST:/wallet/prepare/renew
     * @secure
     */
    prepareRenewCreate: (data: PrepareRenewCreatePayload, params: RequestParams = {}) =>
      this.request<PrepareRenewCreateData, any>({
        path: `/wallet/prepare/renew`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Redistributes a specific amount of funds over a given minimum number of outputs. Used to ensure that the wallet always has a good amount of unspent outputs to use.
     *
     * @tags bus
     * @name RedistributeCreate
     * @summary /wallet/redistribute
     * @request POST:/wallet/redistribute
     * @secure
     */
    redistributeCreate: (data: RedistributeCreatePayload, params: RequestParams = {}) =>
      this.request<RedistributeCreateData, any>({
        path: `/wallet/redistribute`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Signs the provided transaction and returns the signed transaction.
     *
     * @tags bus
     * @name SignCreate
     * @summary /wallet/sign
     * @request POST:/wallet/sign
     * @secure
     */
    signCreate: (data: SignCreatePayload, params: RequestParams = {}) =>
      this.request<SignCreateData, any>({
        path: `/wallet/sign`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Returns all confirmed transactions of the wallet.
     *
     * @tags bus
     * @name TransactionsList
     * @summary /wallet/transactions
     * @request GET:/wallet/transactions
     * @secure
     */
    transactionsList: (params: RequestParams = {}) =>
      this.request<TransactionsListData, any>({
        path: `/wallet/transactions`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  config = {
    /**
     * @description Returns the current config of the autopilot.
     *
     * @tags autopilot
     * @name ConfigList
     * @summary /alerts
     * @request GET:/config
     * @secure
     */
    configList: (params: RequestParams = {}) =>
      this.request<ConfigListData, any>({
        path: `/config`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * @description Updates the config of the autopilot. NOTE: The existing and provided configuration parameters are not merged. All fields must be provided when calling this endpoint.
     *
     * @tags autopilot
     * @name ConfigUpdate
     * @summary /config
     * @request PUT:/config
     * @secure
     */
    configUpdate: (data: ConfigUpdatePayload, params: RequestParams = {}) =>
      this.request<ConfigUpdateData, any>({
        path: `/config`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  debug = {
    /**
     * @description Can be used to manually trigger a maintenance iteration in the autopilot. Should only be used for debugging since the autopilot will periodically do maintenance anyway.
     *
     * @tags autopilot
     * @name TriggerCreate
     * @summary /debug/trigger
     * @request POST:/debug/trigger
     * @secure
     */
    triggerCreate: (data: TriggerCreatePayload, params: RequestParams = {}) =>
      this.request<TriggerCreateData, any>({
        path: `/debug/trigger`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  status = {
    /**
     * @description Returns some status info about the autopilot.
     *
     * @tags autopilot
     * @name StatusList
     * @summary /status
     * @request GET:/status
     * @secure
     */
    statusList: (params: RequestParams = {}) =>
      this.request<StatusListData, any>({
        path: `/status`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  account = {
    /**
     * @description Derives a unique ephemeral account ID to use on the host
     *
     * @tags worker
     * @name AccountDetail
     * @summary /account/:hostkey
     * @request GET:/account/{hostkey}
     * @secure
     */
    accountDetail: (hostkey: string, params: RequestParams = {}) =>
      this.request<AccountDetailData, any>({
        path: `/account/${hostkey}`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  id = {
    /**
     * @description Returns the worker's unique identifier as set by the user.
     *
     * @tags worker
     * @name GetId
     * @summary /account/id
     * @request GET:/id
     * @secure
     */
    getId: (params: RequestParams = {}) =>
      this.request<GetIdData, any>({
        path: `/id`,
        method: "GET",
        secure: true,
        ...params,
      }),
  };
  rhp = {
    /**
     * @description Returns all active contracts. Similar to the equivalent endpoint on the bus but also fetching the latest revision from the hosts and returns it alongside the contract info.
     *
     * @tags worker
     * @name ContractsList
     * @summary /rhp/contracts
     * @request GET:/rhp/contracts
     * @secure
     */
    contractsList: (query: ContractsListParams1, params: RequestParams = {}) =>
      this.request<ContractsListResult, any>({
        path: `/rhp/contracts`,
        method: "GET",
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description Forms a new contract with a host.
     *
     * @tags worker
     * @name FormCreate
     * @summary /rhp/form
     * @request POST:/rhp/form
     * @secure
     */
    formCreate: (data: FormCreatePayload, params: RequestParams = {}) =>
      this.request<FormCreateData, any>({
        path: `/rhp/form`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Fund an ephemeral account with a host.
     *
     * @tags worker
     * @name FundCreate
     * @summary /rhp/fund
     * @request POST:/rhp/fund
     * @secure
     */
    fundCreate: (data: FundCreateBody, params: RequestParams = {}) =>
      this.request<FundCreateResult, any>({
        path: `/rhp/fund`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Renew a contract with a host.
     *
     * @tags worker
     * @name RenewCreate
     * @summary /rhp/renew
     * @request POST:/rhp/renew
     * @secure
     */
    renewCreate: (data: RenewCreatePayload, params: RequestParams = {}) =>
      this.request<any, RenewCreateError>({
        path: `/rhp/renew`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Scans a host.
     *
     * @tags worker
     * @name ScanCreate
     * @summary /rhp/scan
     * @request POST:/rhp/scan
     * @secure
     */
    scanCreate: (data: ScanCreatePayload, params: RequestParams = {}) =>
      this.request<ScanCreateData, any>({
        path: `/rhp/scan`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Syncs the ephemeral account balance of a host with the expected balance of the renter.
     *
     * @tags worker
     * @name SyncCreate
     * @summary /rhp/sync
     * @request POST:/rhp/sync
     * @secure
     */
    syncCreate: (data: SyncCreatePayload, params: RequestParams = {}) =>
      this.request<SyncCreateData, any>({
        path: `/rhp/sync`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
