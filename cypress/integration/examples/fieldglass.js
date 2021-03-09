describe('Timesheet filling against fieldglass', () => {
    let config;
    before((done) => {
        const configFile = process.env.CFG_FILE || "fieldglass_config.json";
        cy.fixture(configFile).then((cfg) => {
            config = cfg;
            done();
        });
    })
    
    it('goes to fieldglass website and waits for the input to be visible', () => {
        cy.visit(config.url);
        cy.get('#usernameId_new').click();
    });

    it('fills in the user credentials', () => {
        cy.get('#usernameId_new').type(config.creds.username);
        cy.get('#passwordId_new').type(config.creds.password);
        cy.get("#passwordId_new").type('{enter}');


    });
    it('goes the latest timesheet to be filled', () => {
        cy.get('a').contains('Complete Time Sheet').click();
        cy.get('#usernameId_new').type(config.creds.username);
        cy.get('#passwordId_new').type(config.creds.password);
        cy.get("#passwordId_new").type('{enter}');
    })
    it('fills in the timesheet for the week', () => {

        const getClassNames = () => {
            const d = new Date();
            const year = d.getFullYear();
            const month = (d.getMonth()+1)<10 ? `0${(d.getMonth()+1)}`: d.getMonth()+1;
           

            let dDay = Number(config.timesheet.startDay);
            const result = [];
            for(let i=0;i<5;i++) {
                const day = dDay<10 ? `0${dDay}`: dDay;
                result.push(`${year}${month}${day}`);
                dDay+=1;
            }
            return result;
        }
     
        const classNames = getClassNames();
        
        classNames.forEach(className=>cy.get('#timeSheetMainTable').find(`.${className}`).first().type(config.timesheet.hours));

        cy.get("th.captionBig").contains("Day").first().click();
    })
    it("clicks on continue later button", () => {
       // cy.get("input#fgTSSubmit").click();
       cy.wait(10000)
    })
})