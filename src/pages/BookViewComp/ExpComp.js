//Drag 확인용 Component 근데 문장 여러개는 오류나서 뺴놓은 듯 걍 Hook 테스트용으로만 쓰는중
const DragText = ({bId, offset}) => {
  let [test, setTest] = useState('');

  let { response, error, loading, setParams, refetch } = useAxios('/bun', false, { bId : selectedBun });

  useEffect(()=>{
    //useAxios 테스트
    console.log(bId);
    setParams( {bId : bId} );
  }, [offset])

  useEffect( ()=>{
    if(response != null){
      setTest(response.data[0]['JATEXT']);
      console.log('response');
    }
  }, [response])

  if(bId == 0){
    return(
      <></>
    )
  }
  return(
    <p>
      {bId}
      {test.substring(offset.startOffset, offset.endOffset)}
    </p>
  )

}

export { DragText };
