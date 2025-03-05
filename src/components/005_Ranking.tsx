import React, { useEffect, useState } from "react";
import { getRanking_Data } from "../gamesets/010_APIget";
import "../styles/011_rankingtable.css";

const Ranking: React.FC = () => {
  const [tableData, setTableData] = useState<any[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getRanking_Data(0);
      const transposed = transposeData(data);
      setTableData(transposed);
      //setTableData(data);
    };

    fetchData();
  }, []);

  return (
    <div style={{ zIndex: 1 }}>
      <div>オンラインランキング</div>
      <br />
      <table>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <br />
    </div>
  );
};

export default Ranking;

function transposeData(data: any) {
  let output: string[][] = [];
  const head: string[] = [
    " ",
    "プレイヤー名",
    "スコア",
    "正確率",
    "平均kpm",
    "最大kpm",
  ];
  output.push(head);
  for (let i = 0; i < 100; i++) {
    const row: string[] = [
      i,
      data[i][1],
      data[i][2].toFixed(0),
      data[i][3].toFixed(2) + "%",
      data[i][4].toFixed(0),
      data[i][5].toFixed(0),
    ];
    output.push(row);
  }
  return output;
}
