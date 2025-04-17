class PortfolioController {

    static async getAll(req, res) {
        res.send("All portfolios");
    }

    static async get(req, res) {
        console.log(req.params);


        res.send(req.params );
    }

}
export default PortfolioController;