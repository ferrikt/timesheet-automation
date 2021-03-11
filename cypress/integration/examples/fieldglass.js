import {  startOfWeek, getDate,  getMonth, getYear, add} from 'date-fns'

describe('Timesheet filling against fieldglass', () => {
    let config;
    beforeEach(() => {
        // Preserve cookie in every test
        Cypress.Cookies.defaults({
          whitelist: (cookie) => {
            return true;
          }
        })
      });

    before((done) => {
        const configFile = process.env.CFG_FILE || "fieldglass_config.json";
        cy.fixture(configFile).then((cfg) => {
            config = cfg;
            done();
        });
    })
    
    it('goes to fieldglass website', () => {
        cy.visit(config.url);
    });

    it('fills in the user credentials', () => {
        cy.get('#usernameId_new').type(config.creds.username);
        cy.get('#passwordId_new').type(config.creds.password);
        cy.get("#passwordId_new").type('{enter}');
    });

    it('goes the latest timesheet to be filled', () => {
        cy.get('a').contains('Complete Time Sheet').click();
    })

    it('fills in the timesheet for the week - 5 days', () => {

        const getClassNames = () => {
            const result = [];

            let currentDate = startOfWeek(new Date(), {weekStartsOn: 1});
            let currentDay = getDate(currentDate);
           
            for(let i=0;i<5;i++) {
                const day = currentDay<10 ? `0${currentDay}`: currentDay;
                const month = (getMonth(currentDate)+1)<10 ? `0${(getMonth(currentDate)+1)}`: getMonth(currentDate)+1;
                const year = getYear(currentDate);

                result.push(`${year}${month}${day}`);
                currentDate = add(currentDate, {days:1});
                currentDay = getDate(currentDate);
            }

            return result;

        }
     
        const classNames = getClassNames();
        
        //TO DO: should clean inputs be4 putting any value
        classNames.forEach(className=>cy.get('#timeSheetMainTable').find(`.${className}`).first().type(config.timesheet.hours));

        cy.get("th.captionBig").contains("Day").first().click();

    })
    it("clicks on `Save Draft` button", () => {
        cy.get('#commentsz2103080136591235600382d').type('no comment');
        cy.get('.formButton').click();
        
        cy.wait(10000)
    })
})
