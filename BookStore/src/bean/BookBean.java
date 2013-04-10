package bean;

import java.io.Serializable;

import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * Contains all details about one single book
 * @author ssheriff
 *
 */
public class BookBean implements Serializable{

	private static final long serialVersionUID = -3409927196328235078L;
	private String bookTitle;
	private String isbn;
	private String author;
	private int price;
	private String imgSrc;
	private boolean isBestBook;
	private String publishedDate;	
	private int stock = 5;
	
	public BookBean(String bookTitle, String isbn, String author, int price,
			String imgSrc, boolean isBestBook, String publishedDate) {		
		this.bookTitle = bookTitle;
		this.isbn = isbn;
		this.author = author;
		this.price = price;
		this.imgSrc = imgSrc;
		this.isBestBook = isBestBook;
		
		if(!publishedDate.equals("false"))
			this.publishedDate = publishedDate;
		else
			this.publishedDate = " Some day";
	}
	
	public String getBookTitle() {
		return bookTitle;
	}
	public String getIsbn() {
		return isbn;
	}
	public String getAuthor() {
		return author;
	}
	public int getPrice() {
		return price;
	}
	public String getImgSrc() {
		return imgSrc;
	}
	public boolean isBestBook() {
		return isBestBook;
	}
	public String getPublishedDate() {
		return publishedDate;
	}
	public int getStock() {
		return stock;
	}
	
	public void addToCart() {
		if(this.stock > 0)
			this.stock--;
	}
	
	
	public String toString()
	{
		return "BookBean [bookTitle=" + bookTitle + ", isbn=" + isbn
				+ ", author=" + author + ", price=" + price + ", imgSrc="
				+ imgSrc + ", isBestBook=" + isBestBook + ", publishedDate="
				+ publishedDate + ", stock=" + stock + "]";
	}
	
	public String toHTMLString(){
		return "<td>" + bookTitle + "</td><td>" + isbn
				+ "</td><td>" + author + "</td><td>" + price + "</td><td style=\"text-align:center;\"><img style=\"width:50px; height:50px;\" src=\""
				+ imgSrc + "\" alt=\"Couldn't retrieve image\"/>" + "</td><td>" + isBestBook + "</td><td>"
				+ publishedDate + "</td><td>" + stock + "</td>";
	}
	
	public Element toXMLElement(Document document) {
		Element book = document.createElement("book");
		
		Element name = document.createElement("name");
		name.appendChild(document.createTextNode(this.bookTitle));
		Element isbn = document.createElement("isbn");
		isbn.appendChild(document.createTextNode(this.isbn));
		Element author = document.createElement("author");
		author.appendChild(document.createTextNode(this.author));
		Element price = document.createElement("price");
		price.appendChild(document.createTextNode("" + this.price));
		Element imgSrc = document.createElement("imgSrc");
		imgSrc.appendChild(document.createTextNode(this.imgSrc));
		Element isBestBook = document.createElement("isBestBook");
		isBestBook.appendChild(document.createTextNode("" + this.isBestBook));
		Element publishedDate = document.createElement("publishedDate");
		publishedDate.appendChild(document.createTextNode(this.publishedDate));
		
		book.appendChild(name);
		book.appendChild(isbn);
		book.appendChild(author);
		book.appendChild(price);
		book.appendChild(imgSrc);
		book.appendChild(isBestBook);
		book.appendChild(publishedDate);
		
		return book;
	}
}
