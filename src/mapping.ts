import { BigInt, store } from "@graphprotocol/graph-ts"
import {
  Library,
  Record,
  Revoke
} from "../generated/Library/Library"
import { Book, Author } from "../generated/schema"

export function handleRecord(event: Record): void {

  let author = Author.load(event.params.author + '-' + event.params.authorWallet.toHexString())
  if (!author) {
    author = new Author(event.params.author + '-' + event.params.authorWallet.toHexString())
    author.name = event.params.author
    author.wallet = event.params.authorWallet
    author.bookCount = BigInt.fromI32(1)
    author.save()
  } else {
    author.bookCount = author.bookCount.plus(BigInt.fromI32(1))
    author.save()
  }

  let book = new Book(event.transaction.hash.toHexString())
  book.title = event.params.title
  book.author = author.id
  book.content = event.params.content
  book.tags = event.params.tags
  book.timestamp = event.block.timestamp
  book.save()

}

export function handleRevoke(event: Revoke): void {

  let book = Book.load(event.params.id.toHexString())
  if (book) {
    store.remove("Book", book.id)
    let author = Author.load(book.author)
    if (author) {
      if (author.bookCount <= BigInt.fromI32(1)) {
        store.remove('Author', author.id)
      } else {
        author.bookCount = author.bookCount.minus(BigInt.fromI32(1))
        author.save()
      }
    }
  }
}
