
const User = require("../../models/user")
const bcrypt  = require('bcrypt')
const passport= require("passport")



function authcontroller(){
    return{
        login(req,res){
            res.render("auth/login")
        },

        postLogin(req,res){
            passport.authenticate('local',(err,user,info)=>{
                if(err) {
                    req.flash('error',info.message)
                    return next(err)
                }
                if(!user) {
                    req.flash('error',info.message)
                    return res.redirect('/login')
                }

                req.logIn(user,(err)=>{
                    if(err) {
                        req.flash('error', info.message)
                        return next(err)
                    }
                    return res.redirect('/')
                })
            })(req,res)
        },

        register(req,res){
            res.render("auth/register")
        },

       async  postRegister(req,res){
            const {name,email,password} = req.body
            if(!name || !email || !password){
                req.flash('error','All fields are required')
                req.flash('name', name)
                req.flash('email', email)
                return res.redirect('/register')
            }
            
            if(password.length < 6){
                req.flash('name', name)
                req.flash('email', email)
                req.flash('error','password must more than six character')
                return res.redirect("/register")
            }
            User.exists({email : email}, (err,result) =>{
                if(result){
                    req.flash('error','Email already exist')
                    req.flash('name',name)
                    req.flash('email',email)  
                    return res.redirect("/register")  
                }
            })
            const hashedPassword = await bcrypt.hash(password, 10)
            
            const user = new User({
                name: name,
                email:email,
                password: hashedPassword
            })
           
            user.save().then(user =>{
                //Login
                return res.redirect('/login')
            }).catch(err=>{
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
            console.log(user)
            
        },
        logout(req,res) {
            req.logout()
            return res.redirect("/login")
        }   
    }
}

module.exports = authcontroller