import {expect} from 'chai' 
import {validateRegisterData} from '../helpers/validators/authData.js'

describe('ValidateRegisterData function', function () {
    it('should validate when input is correct', function() {
        const mockData = {
            email: 'mock@data.com',
            name: 'Foo Bar',
            username: 'Foobar',
            password: 'password'
        };

        const result = validateRegisterData(mockData);

        expect(result.valid).to.be.true;
    })
    it('should return error when password is too short', function() {
        const mockData = {
            email: 'mock@data.com',
            name: 'Foo Bar',
            username: 'Foobar',
            password: 'four'
        };

        const result = validateRegisterData(mockData);

        expect(result.valid).to.be.false;
        expect(result.errors.password).to.be.string('Fejl på password')
    })
    it('should return error when email does not contain @', function() {
        const mockData = {
            email: 'mockdata.com',
            name: 'Foo Bar',
            username: 'Foobar',
            password: 'password'
        };

        const result = validateRegisterData(mockData);

        expect(result.valid).to.be.false;
        expect(result.errors.email).to.be.string('Fejl på email')
    })
    it('should return error when username is less than two characters', function() {
        const mockData = {
            email: 'mockdata.com',
            name: 'Foo Bar',
            username: 'F',
            password: 'password'
        };

        const result = validateRegisterData(mockData);

        expect(result.valid).to.be.false;
        expect(result.errors.username).to.be.string('Fejl på brugernavn')
    })
    it('should return error when name is less than two characters', function() {
        const mockData = {
            email: 'mockdata.com',
            name: 'F',
            username: 'Foobar',
            password: 'password'
        };

        const result = validateRegisterData(mockData);

        expect(result.valid).to.be.false;
        expect(result.errors.name).to.be.string('Fejl på navn')
    })
    it('should return error when an empty string is given', function() {
        const mockData = {
            email: '',
            name: '',
            username: '',
            password: ''
        };

        const result = validateRegisterData(mockData);

        expect(result.valid).to.be.false;
        expect(result.errors.name).to.be.string('Fejl på navn')
        expect(result.errors.username).to.be.string('Fejl på brugernavn')
        expect(result.errors.email).to.be.string('Fejl på email')
        expect(result.errors.password).to.be.string('Fejl på password')

    })
    it('should return error when a value given is undefined', function() {
        const mockData = {
            email: undefined,
            name: undefined,
            username: undefined,
            password: undefined
        };

        const result = validateRegisterData(mockData);

        expect(result.valid).to.be.false;
        expect(result.errors.name).to.be.string('Fejl på navn')
        expect(result.errors.username).to.be.string('Fejl på brugernavn')
        expect(result.errors.email).to.be.string('Fejl på email')
        expect(result.errors.password).to.be.string('Fejl på password')
    })
    it('should return error when a value given is not a string', function() {
        const mockData = {
            email: 123546123,
            name: null,
            username: {foo: 'bar'},
            password: true
        };

        const result = validateRegisterData(mockData);

        expect(result.valid).to.be.false;
        expect(result.errors.name).to.be.string('Fejl på navn')
        expect(result.errors.username).to.be.string('Fejl på brugernavn')
        expect(result.errors.email).to.be.string('Fejl på email')
        expect(result.errors.password).to.be.string('Fejl på password')
    })
})