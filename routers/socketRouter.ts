import { Router } from "express";
import { bci } from "..";
const router = Router();

router.get("/:type", async (req, res) => {
  const type = req.params.type;
  const qs = req.query;

  const timeout = setTimeout(() => {
    res.status(500).json({ error: "Request timed out" });
  }, 10000);

  bci.getData(
    {
      type,
      ...qs,
    },
    (data, took) => {
      res.json({
        data,
        took,
      });
      clearTimeout(timeout);
    }
  );
});

export default router;
