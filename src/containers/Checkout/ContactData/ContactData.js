import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {

    state={
        orderForm:{
            name:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Your name'
                },
                value:'',
                validation:{
                    required: true,
                },
                valid: false,
                touched:false
            },
            street:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Street'
                },
                value:'',
                validation:{
                    required: true,
                },
                valid: false,
                touched:false
            },
            zipCode:{
                elementType:'input',
                elementConfig:{
                    type:'text',
                    placeholder:'Zip Code'
                },
                value:'',
                validation:{
                    required: true,
                    maxLength:5,
                    minLength:5
                },
                valid: false,
                touched:false
            },

            email:{
                elementType:'input',
                elementConfig:{
                    type:'email',
                    placeholder:'Your email'
                },
                value:'',
                validation:{
                    required: true,
                },
                valid: false,
                touched:false
            },
            country:{
                elementType:'input',
                elementConfig:{
                    type:'select',
                    placeholder:'Country',
                },
                validation:{
                    required: true,
                },
                valid: false,
                touched:false,
                value:''
            },
            deliveryMethod:{
                elementType:'select',
                elementConfig:{
                    options:[{value:'fastest', displayValue:'Fastest'},
                        {value:'cheapest', displayValue:'Cheapest'}
                    ]
                },
                value:'fastest',
                valid: true,
                validation:{}
            },
        },

        formIsValid:false,
        drink: 0,
        sauces:[]
    }

    orderHandler = (event) =>{
        event.preventDefault();
        console.log(this.props.ingredients);
        this.setState({loading:true});
        const formData = {};

        for (let formElementIdentifier in this.state.orderForm){
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }

        const order={
            ingredients:this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId:this.props.userId

        }

        this.props.purchaseBurgerStart(order, this.props.token);
        this.props.resetIngredients();
        // axios.post('/orders.json',order)
        //     .then(response=>  {
        //         this.setState({loading:false});
        //         this.props.history.push('/');
        //     })
        //     .catch(error=> {
        //         this.setState({loading:false});
        //     });
    }

    checkValidity(value,rules){
        let isValid=true;

        if(rules.required){
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid;
        }

        if(rules.maxLength){
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value,updatedFormElement.validation);
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        updatedFormElement.touched = true;

        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({orderForm: updatedOrderForm, formIsValid:formIsValid});
    }



    render(){
        let formElementsArray=[];

        for(let key in this.state.orderForm){
            formElementsArray.push({
                id:key,
                config:this.state.orderForm[key]
            });
        }

        let form=(
            <div className={classes.Form}>
                <form action="" onSubmit={this.orderHandler}>
                    {formElementsArray.map(formElement=>(
                        <Input
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            value={formElement.config.value}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            touched={formElement.config.touched}
                            changed={(event) => this.inputChangedHandler(event, formElement.id)} />

                    ))}
                    <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
                </form>
            </div>
            );
        if (this.props.loading){
            form=<Spinner/>;
        }


        return(
            <div>
                <div className={classes.ContactData}>
                    <h4>Enter your contact data </h4>
                    {form}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return{
        ings:state.burgerBuilder.ingredients,
        price:state.burgerBuilder.price,
        loading:state.order.loading,
        token: state.auth.token,
        userId:state.auth.userId
    }
};
const mapDispatchToProps = dispatch =>{
    return {
        purchaseBurgerStart: (orderData, token)=> dispatch(actions.purchaseBurger(orderData, token)),
        resetIngredients: () => dispatch(actions.resetIngredients())
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(ContactData, axios));