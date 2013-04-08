package bean;

import java.io.Serializable;

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
}
