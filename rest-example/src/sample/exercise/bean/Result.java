package sample.exercise.bean;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Result {
  public Result() {
    super();
  }

  public Result(String description, String success) {
    super();
    this.description = description;
    this.success = success;
  }

  private String description;
  
  private String success;

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getSuccess() {
    return success;
  }

  public void setSuccess(String success) {
    this.success = success;
  }
  

}
