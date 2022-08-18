export const mintNFT = 
`
// REPLACE THIS WITH YOUR CONTRACT NAME + ADDRESS
import Shape from 0xa019c66fdef2931c

// Do not change these
import NonFungibleToken from 0x631e88ae7f1d7c20
import MetadataViews from 0x631e88ae7f1d7c20

transaction(
  recipient: Address,
  name: String,
  description: String,
  thumbnail: String,
) {
  prepare(signer: AuthAccount) {
    if signer.borrow<&Shape.Collection>(from: Shape.CollectionStoragePath) != nil {
      return
    }

    // Create a new empty collection
    let collection <- Shape.createEmptyCollection()

    // save it to the account
    signer.save(<-collection, to: Shape.CollectionStoragePath)

    // create a public capability for the collection
    signer.link<&{NonFungibleToken.CollectionPublic, MetadataViews.ResolverCollection}>(
      Shape.CollectionPublicPath,
      target: Shape.CollectionStoragePath
    )
  }


  execute {
    // Borrow the recipient's public NFT collection reference
    let receiver = getAccount(recipient)
      .getCapability(Shape.CollectionPublicPath)
      .borrow<&{NonFungibleToken.CollectionPublic}>()
      ?? panic("Could not get receiver reference to the NFT Collection")

    // Mint the NFT and deposit it to the recipient's collection
    Shape.mintNFT(
      recipient: receiver,
      name: name,
      description: description,
      thumbnail: thumbnail,
    )
    
    log("Minted an NFT and stored it into the collection")
  } 
}
`