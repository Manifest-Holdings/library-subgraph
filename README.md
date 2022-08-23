# This is the hosted subgraph for the library.sol contract

### Setting up Hardhat + Subgraph locally
1. npx hardhat node --hostname 0.0.0.0 
2. npx hardhat run --network localhost scripts/deploy-test.js <— deploy contracts here 
3. Run a script to mint loot/gm/etc using localhost as provider 
4. Setup subgraph https://thegraph.academy/developers/local-development/ 
5. Update docker-compose.yml file to: ethereum: 'mainnet:http://host.docker.internal:8545/'before you run docker-compose up 
6. Update subgraph.yaml to point to hardhat contract addresses, e.g. Loot address: '0x5FbDB2315678afecb367f032d93F642f64180aa3' # '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7' 
7. yarn run codegen 
8. yarn run build 

Local
9. yarn run create-local 
10. yarn run deploy-local

Hosted
9. graph auth --product hosted-service 9a5f477af4ca427ea1a2e8194d59b4a0
10. graph deploy --product hosted-service open-quill-foundation/librarium-testnet