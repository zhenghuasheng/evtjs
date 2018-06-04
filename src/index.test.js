/* eslint-env mocha */
const assert = require('assert')
const fs = require('fs')
const EVT = require('.')
const { Keystore } = require('eosjs-keygen')
const ByteBuffer = require('bytebuffer')
const Fcbuffer = require('fcbuffer')
const Key = require("./key")

const wif = '5JH8KHTRhdzzT8cQXaLNKjp28wYGdLtswBPCqMw4kwgMv8jUSHB'
const network = {
    host: 'testnet1.everitoken.io',
    port: 8888,
    protocol: 'https'
};

describe('version', () => {
    it('exposes a version number', () => {
        assert.ok(EVT.version)
    })
})

const randomName = () => {
    const name = String(Math.round(Math.random() * 1000000000)).replace(/[0,6-9]/g, '')
    return 'a' + name + '111222333444'.substring(0, 11 - name.length) // always 12 in length
}

describe('APICaller test', () => {
    // get evt chain version
    it('getInfo', async function () {
        const apiCaller = EVT({
            endpoint: network
        });

        var response = await apiCaller.getInfo();
        assert(response.evt_api_version, "expected evt_api_version");
    });

    it('getAccount', async function () {
        const apiCaller = EVT({
            endpoint: network,
            keyProvider: wif
        });

        var response = await apiCaller.getAccount('ceeji');
        // console.error("getAccount" + JSON.stringify(response, null, 4));
        assert(response.balance, "expected balance");
    });

    it('getJoinedDomainList', async function () {
        const apiCaller = EVT({
            endpoint: network,
            keyProvider: wif
        });

        var response = await apiCaller.getJoinedDomainList('ceeji');
        console.error(JSON.stringify(response, null, 4));
        assert(Array.isArray(response), "expected array");
    });

    it('getJoinedGroupList', async () => {
        const apiCaller = EVT({
            endpoint: network,
            keyProvider: wif
        });

        var response = await apiCaller.getJoinedGroupList('ceeji');
        console.error(JSON.stringify(response, null, 4));
        assert(Array.isArray(response), "expected array");
    });

    it('getOwnedTokens', async () => {
        const apiCaller = EVT({
            endpoint: network,
            keyProvider: wif
        });

        var response = await apiCaller.getOwnedTokens('ceeji');
        console.error(JSON.stringify(response, null, 4));
        assert(Array.isArray(response), "expected array");
    });

    it('newAccount', async () => {
        const apiCaller = EVT({
            keyProvider: wif,
            endpoint: network
        });

        try {
            console.log(JSON.stringify(await apiCaller.pushTransaction({
                transaction: {
                    actions: [
                        {
                            "action": "newaccount",
                            "args": {
                                "name": 'test',
                                "owner": [ Key.privateToPublic(wif) ]
                            }
                        }
                    ]
                }
            })));
        }
        catch (e) { }
    });

    it('newdomain', async function () {
        const apiCaller = new EVT({
            host: '192.168.1.104',
            port: '8888',
            keyProvider: wif,
            endpoint: network
        });

        var newDomainName = "nd" + (new Date()).valueOf();

        await apiCaller.pushTransaction({
            transaction: {
                actions: [
                    {
                        "action": "newdomain",
                        "args": {
                            "name": newDomainName,
                            "issuer": "EVT7dwvuZfiNdTbo3aamP8jgq8RD4kzauNkyiQVjxLtAhDHJm9joQ",
                            "issue": {
                                "name": "issue",
                                "threshold": 1,
                                "authorizers": [{
                                    "ref": "[A] EVT7dwvuZfiNdTbo3aamP8jgq8RD4kzauNkyiQVjxLtAhDHJm9joQ",
                                    "weight": 1
                                }]
                            },
                            "transfer": {
                                "name": "transfer",
                                "threshold": 1,
                                "authorizers": [{
                                    "ref": "[G] OWNER",
                                    "weight": 1
                                }]
                            },
                            "manage": {
                                "name": "manage",
                                "threshold": 1,
                                "authorizers": [{
                                    "ref": "[A] EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                                    "weight": 1
                                }]
                            }
                        }
                    }
                ]
            }
        });
    });

    it('issue_tokens', async function () {
        const apiCaller = new EVT({
            host: '192.168.1.104',
            port: '8888',
            keyProvider: wif,
            endpoint: network
        });

        var newDomainName = "nd" + (new Date()).valueOf();

        try {
            await apiCaller.pushTransaction({
                transaction: {
                    actions: [
                        {
                            "action": "issuetoken",
                            "args": {
                                "domain": "nd",
                                "names": [
                                    "t1",
                                    "t2",
                                    "t3"
                                ],
                                "owner": [
                                    Key.privateToPublic(wif)
                                ]
                            }
                        }
                    ]
                }
            });
        }
        catch (e) { }
    });

    it('new_group', async function () {
        const apiCaller = new EVT({
            host: '192.168.1.104',
            port: '8888',
            keyProvider: wif,
            endpoint: network
        });

        var newDomainName = "nd" + (new Date()).valueOf();

        try {
            await apiCaller.pushTransaction({
                transaction: {
                    actions: [
                        {
                            "action": "newgroup",
                            "args": {
                                "name": "testgroup",
                                "group": {
                                    "name": "testgroup",
                                    "key": Key.privateToPublic(wif),
                                    "root": {
                                        "threshold": 6,
                                        "weight": 0,
                                        "nodes": [
                                            {
                                                "threshold": 1,
                                                "weight": 3,
                                                "nodes": [
                                                    {
                                                        "key": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                                                        "weight": 1
                                                    },
                                                    {
                                                        "key": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                                                        "weight": 1
                                                    }
                                                ]
                                            },
                                            {
                                                "key": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                                                "weight": 3
                                            },
                                            {
                                                "threshold": 1,
                                                "weight": 3,
                                                "nodes": [
                                                    {
                                                        "key": "EVT6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV",
                                                        "weight": 1
                                                    },
                                                    {
                                                        "key": "EVT8MGU4aKiVzqMtWi9zLpu8KuTHZWjQQrX475ycSxEkLd6aBpraX",
                                                        "weight": 1
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    ]
                }
            });
        }
        catch (e) { }
    });
});
