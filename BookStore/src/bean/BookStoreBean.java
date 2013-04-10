package bean;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerConfigurationException;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

/**
 * Contains details about a collection of books
 * @author ssheriff
 *
 */
public class BookStoreBean {
	private LinkedHashMap<String, BookBean> bookList;
	private static String path;
		
	public String toHTMLString() {
		String str = "<br/><br/><table border=\"4\">";
		str += "<tr>" +
				"<th>Title</th>" +
				"<th>ISBN</th>" +
				"<th>Author</th>" +
				"<th>Price</th>" +
				"<th>Image Source</th>" +
				"<th>Is Best Book</th>" +
				"<th>Date Published</th>" +
				"<th>Stock</th>" +
				"</tr>";
		Iterator<String> iter = bookList.keySet().iterator();
		while(iter.hasNext()){
			str += "<tr>" + bookList.get(iter.next()).toHTMLString() + "</tr>";
		}
		return str;
	}

	public BookStoreBean(){
		bookList = new LinkedHashMap<String, BookBean>();
	}
	
	public BookStoreBean(String path){
		this();
		this.path = path;
		populateBookStore(path);		
	}
	
	public BookStoreBean(BookStoreBean bookStoreBean){
		this.bookList = (LinkedHashMap<String, BookBean>) bookStoreBean.bookList.clone();
	}

	public LinkedHashMap<String, BookBean> getBookList() {
		return bookList;
	}
	
	public void addBookBean(BookBean bookBean){
		bookList.put(bookBean.getIsbn(), bookBean);		
	}
	
	public void clear(){
		bookList.clear();
	}
	
	public boolean isEmpty(){
		return bookList.isEmpty();
	}
	
	public BookStoreBean searchByTitle(String title){
		if(title.trim().equals(""))
			return null;
		
		title = title.toLowerCase();
		BookStoreBean searchResults = new BookStoreBean();
		for(BookBean bookBean : bookList.values()){
			if(bookBean.getBookTitle().toLowerCase().indexOf(title) != -1)
				searchResults.addBookBean(bookBean);
		}
		return searchResults;
	}
	
	public BookBean searchByISBN(String isbn) {		
		return bookList.get(isbn);
	}
	
	/**
	 * Adds the book (with the given isbn), if available, to the current user's shopping cart, and reduces the stock of the book by one.
	 * @param isbn
	 * @return
	 */
	public BookBean addToCart(String isbn){
		BookBean bookBean = searchByISBN(isbn);
		bookBean.addToCart();
		return bookBean;
	}
	
	/**
	 * Inserts a book in the XML file and returns true if the operation is successful
	 * @param path
	 * @param bookBean
	 * @return
	 */
	public boolean insertBook(String path, BookBean bookBean)
	{
		try{
			Logger.getLogger(BookStoreBean.class.getName()).log(Level.SEVERE, "PATH =  " + path);
            File xmlFile = new File(path);
            DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();            
            Document document = documentBuilder.parse(xmlFile);
            
            //Get the root element of the xml Document;
            Node root = document.getFirstChild();
            Logger.getLogger(BookStoreBean.class.getName()).log(Level.SEVERE, "documentElement:" + root.toString());
            Element book = document.createElement("book");
            
            Element name = document.createElement("name");
            name.appendChild(document.createTextNode(bookBean.getBookTitle()));
            Element isbn = document.createElement("isbn");
            isbn.appendChild(document.createTextNode(bookBean.getIsbn()));
            Element author = document.createElement("author");
            author.appendChild(document.createTextNode(bookBean.getAuthor()));
            Element price = document.createElement("price");
            price.appendChild(document.createTextNode("" + bookBean.getPrice()));
            Element imgSrc = document.createElement("imgSrc");
            imgSrc.appendChild(document.createTextNode(bookBean.getImgSrc()));
            Element isBestBook = document.createElement("isBestBook");
            isBestBook.appendChild(document.createTextNode("" + bookBean.isBestBook()));
            Element publishedDate = document.createElement("publishedDate");
            publishedDate.appendChild(document.createTextNode(bookBean.getPublishedDate()));
    		
            book.appendChild(name);
            book.appendChild(isbn);
            book.appendChild(author);
            book.appendChild(price);
            book.appendChild(imgSrc);
            book.appendChild(isBestBook);
            book.appendChild(publishedDate);
            
    		root.appendChild(book);
    		
    		TransformerFactory transformerFactory = TransformerFactory.newInstance();
    		Transformer transformer = transformerFactory.newTransformer();
    		DOMSource source = new DOMSource(document);
    		StreamResult result = new StreamResult(new File(path));
    		transformer.transform(source, result);
     
    		System.out.println("Done");
    		populateBookStore(path);
    		return true;
        } catch (SAXException ex) {
            Logger.getLogger(BookStoreBean.class.getName()).log(Level.SEVERE, null, ex);
        } catch (IOException ex) {
            Logger.getLogger(BookStoreBean.class.getName()).log(Level.SEVERE, null, ex);
        } catch (ParserConfigurationException ex) {
            Logger.getLogger(BookStoreBean.class.getName()).log(Level.SEVERE, null, ex);
        } catch (TransformerConfigurationException ex){
        	Logger.getLogger(BookStoreBean.class.getName()).log(Level.SEVERE, null, ex);
		} catch (TransformerException ex){
			Logger.getLogger(BookStoreBean.class.getName()).log(Level.SEVERE, null, ex);
		}
    
		return false;
	}
	
	/**
	 * Deletes a book from the XML file
	 * @param path
	 * @param isbn
	 */
	public void deleteBook(String path, String isbn){
		try{
			Logger.getLogger(BookStoreBean.class.getName()).log(Level.SEVERE, "PATH =  " + path);
            File xmlFile = new File(path);
            DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();            
            Document document = documentBuilder.parse(xmlFile);
            
            //Get the root element of the xml Document;
            Node root = document.getFirstChild();
            Logger.getLogger(BookStoreBean.class.getName()).log(Level.SEVERE, "documentElement:" + root.toString());
            
            NodeList nList = document.getElementsByTagName("book");			
			
			for (int temp = 0; temp < nList.getLength(); temp++) {			 
				Node nNode = nList.item(temp);			
		 
				if (nNode.getNodeType() == Node.ELEMENT_NODE) {
		 
					Element eElement = (Element) nNode; 
					
					if(eElement.getElementsByTagName("isbn").item(0).getTextContent().equalsIgnoreCase(isbn)){
						root.removeChild(nNode);
						break;									
					}
				}
			}
			
			// write the content into xml file
			TransformerFactory transformerFactory = TransformerFactory.newInstance();
			Transformer transformer = transformerFactory.newTransformer();
			DOMSource source = new DOMSource(document);
			StreamResult result = new StreamResult(new File(path));
			transformer.transform(source, result);
	 
			System.out.println("Done");
			populateBookStore(path);
		} catch (ParserConfigurationException pce) {
			pce.printStackTrace();
		} catch (TransformerException tfe) {
			tfe.printStackTrace();
		} catch (IOException ioe) {
			ioe.printStackTrace();
		} catch (SAXException sae) {
			sae.printStackTrace();
		}
	}

	/**
	 * Populates the bookstorebean with data from an XML file
	 * @param path
	 */
	private void populateBookStore(String path) {
		try{		
			bookList.clear();
			
			File fXMLFile = new File(path);
			DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
			DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
			Document doc = dBuilder.parse(fXMLFile);		
			doc.getDocumentElement().normalize();	
			
			NodeList nList = doc.getElementsByTagName("book");			
			
			for (int temp = 0; temp < nList.getLength(); temp++) {
				 
				Node nNode = nList.item(temp);			
		 
				if (nNode.getNodeType() == Node.ELEMENT_NODE) {
		 
					Element eElement = (Element) nNode;
		 
					String bookName = eElement.getElementsByTagName("name").item(0).getTextContent();
					String isbn = eElement.getElementsByTagName("isbn").item(0).getTextContent();
					String author = eElement.getElementsByTagName("author").item(0).getTextContent();
					int price = Integer.parseInt(eElement.getElementsByTagName("price").item(0).getTextContent());
					String imgSrc = eElement.getElementsByTagName("imgSrc").item(0).getTextContent();
					boolean isBestBook = Boolean.parseBoolean(eElement.getElementsByTagName("isBestBook").item(0).getTextContent());
					String publishedDate = eElement.getElementsByTagName("publishedDate").item(0).getTextContent();
					
					
					addBookBean(new BookBean(bookName, isbn, author, price, imgSrc, isBestBook, publishedDate));				
				}
			}
			
			
			
		}catch (Exception e) {
			e.printStackTrace();
	    }
	}
	
	public static String getPath(){
		return path;
	}
}
