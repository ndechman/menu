var selectedCategory = "";

var menuCategories = [];

var menuData = [];

var ItemModal = React.createClass({
  render: function () {
    return (
      <div id={"myModal" + this.props.keyref} className="modal fade" role="dialog">
        <div className="modal-dialog">

          <div className="modal-content">
            <div className="modal-header itemheader">
              <button type="button" className="close" data-dismiss="modal">&times;</button>
              <h4 className="modal-title">{this.props.data.longName}</h4>
            </div>
            <div className="modal-body itembody">
              <img className="img-responsive" src={"images/" + this.props.data.imageLg}/>
              <p>{this.props.data.description}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>

        </div>
      </div>
    );
  }
});

var MenuItem = React.createClass({
  render: function () {
    return (
      <div className="col-md-3 col-sm-6 col-xs-12 text-center item">
        <a href="#" data-toggle="modal" data-target={"#myModal" + this.props.keyref}><img src={"images/" + this.props.image}/></a><br/>
        <a href="#" data-toggle="modal" data-target={"#myModal" + this.props.keyref}>{this.props.name}</a>
        <ItemModal keyref={this.props.keyref} data={this.props.data} />
      </div>
    );
  }
});

var MenuItems = React.createClass({
  render: function () {
    var items;
    if (selectedCategory == "") {
      items =  (<div/>);
    } else {
      items = this.props.menu.map(function (menuItem, index) {
        if (menuItem.category == selectedCategory) {
          return (
            <MenuItem
              key={index}
              keyref={index}
              image={menuItem.imageSm}
              name={menuItem.shortName}
              data={menuItem}
            />
          );
        } else {
          return;
        }
      });
    }
    
    return (
      <div className="row">
        <div className="col-xs-12">
        {items}
        </div>
      </div>
    );
  }
});

var Category = React.createClass({
  handleClick: function() {
    this.props.handleClick(this.props.name)
  },

  render: function () {
    var activeClass = "";
    if (selectedCategory == this.props.name) {
      activeClass = "active";
    }
    return (
      <li className={activeClass} onClick={this.handleClick}>
        <a href="#">{this.props.name}</a>
      </li>
    );
  }
});

var Categories = React.createClass({
  render: function () {
    var handleClick = this.props.handleClick
    var items = this.props.cats.map(function (category, index) {
      return (
        <Category
          key={index}
          name={category.name}
          handleClick={handleClick}
        />
      );
    });
    
    return (
      <div className="row">
        <ul className="nav nav-pills nav-justified menuitems">
          {items}
        </ul>
      </div>
    );
  }
});

var MainWrapper = React.createClass({
  getInitialState: function() {
    return {
      selectedCategory: selectedCategory
    }
  },
  componentDidMount: function() {
    var thisClass = this;
    $.ajax({
      url: 'http://vortwebsys.com/wendys/php/getmenu.php',
      type: 'GET',
      success: function(data) {
        var returnedData = $.parseJSON(data);
        menuCategories = returnedData.categories;
        menuData = returnedData.menu;
        thisClass.setState({
          selectedCategory: selectedCategory
        });
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) { 
        console.log("data fetch; Status: " + textStatus + "; Error: " + errorThrown); 
      }
    });
  },
  handleClick: function(name) {
    selectedCategory = name;
    this.setState({
      selectedCategory: selectedCategory
    });
  },
  render: function () {
    return (
      <div className="container">
        <Categories cats={menuCategories} handleClick={this.handleClick}/>
        <MenuItems menu={menuData} />
      </div>
    );
  }
});

ReactDOM.render(
  <MainWrapper/>,
  document.getElementById('root')
);
