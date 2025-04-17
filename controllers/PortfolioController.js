class PortfolioController {

    static async getAll(req, res) {
        res.send("All portfolios");
    }

    static async get(req, res) {
        const portfolioID = req.params.id;
        const accountID = req.params.accountID;

        res.send(req.params );
    }

}
export default PortfolioController;